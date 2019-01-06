/**
 * Copyright (c) Samsung, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import stringify from "json-stable-stringify";
import path from "path";
import { SourceFile, VariableDeclarationKind } from "ts-simple-ast";
import { IClassSnapshot, ISnapshot, SingleClassMockTree } from "../contracts";
import { ClassSnapshotTag } from "../matchers/ClassMockMatcher";
import { MockGenerator } from "./base";
import { parseClassSnapshots } from "./parsers";

export class ClassSpyGenerator extends MockGenerator {
  generate(
    getFile: (filename: string) => SourceFile,
    allSnapshots: ISnapshot[]
  ) {
    const classSnapshots = this.filterSnapshots(allSnapshots);
    const tree = parseClassSnapshots(classSnapshots);

    Object.keys(tree).forEach(filePath => {
      const file = getFile(this.getFilePath(filePath));
      const { className, classContent } = tree[filePath];
      this.writeSpy(file, className, classContent);
    });
  }

  private filterSnapshots(allSnapshots: ISnapshot[]): IClassSnapshot[] {
    return allSnapshots.filter(snap => snap.key.includes(ClassSnapshotTag));
  }

  private writeSpy(
    file: SourceFile,
    className: string,
    classTree: SingleClassMockTree
  ) {
    this.writeMockshotMockInterface(file);
    this.writeSpyInterface(file, className, classTree);
    this.writeClassTree(file, classTree);
    this.writeGetSpyFunction(file);
    this.writeClassSpy(file, className, classTree);
  }

  private writeMockshotMockInterface(file: SourceFile) {
    file.addInterface({
      name: "MockshotMock<P, T = {}>",
      extends: ["jest.Mock"],
      properties: [
        { name: "mockImplementation(mockName: P)", type: "jest.Mock<T>" },
        {
          name: "mockImplementation(fn: (...args: any[]) => any)",
          type: "jest.Mock<T>"
        },
        { name: "mockImplementationOnce(mockName: P)", type: "jest.Mock<T>" },
        {
          name: "mockImplementationOnce(fn: (...args: any[]) => any)",
          type: "jest.Mock<T>"
        },
        {
          name: "getMock(mockName: P)",
          type: "any"
        }
      ]
    });
  }

  private writeSpyInterface(
    file: SourceFile,
    className: string,
    classTree: SingleClassMockTree
  ) {
    file.addInterface({
      name: `${className}Spy`,
      properties: this.getMethodsTypes(classTree)
    });
  }

  private writeClassTree(file: SourceFile, classTree: SingleClassMockTree) {
    file.addVariableStatement({
      declarationKind: VariableDeclarationKind.Const,
      declarations: [{ name: "classTree", initializer: stringify(classTree) }]
    });
  }

  private writeGetSpyFunction(file: SourceFile) {
    file.addFunction({
      name: "getSpy<P extends string>",
      parameters: [{ name: "methodName", type: "string" }],
      returnType: "MockshotMock<P>",
      bodyText: writer => {
        writer.writeLine("const newSpy = jest.fn() as MockshotMock<P>;");
        writer.writeLine(
          "const getMock = mockName => classTree[methodName][mockName].mock;"
        );
        writer.writeLine(
          "const { mockImplementation, mockImplementationOnce } = newSpy;"
        );
        writer.writeLine("newSpy.mockImplementation = mockName =>");
        writer.writeLine('  typeof mockName === "string"');
        writer.writeLine("    ? mockImplementation(() => getMock(mockName))");
        writer.writeLine("    : mockImplementation(mockName);");
        writer.writeLine("newSpy.mockImplementationOnce = mockName =>");
        writer.writeLine('  typeof mockName === "string"');
        writer.writeLine(
          "    ? mockImplementationOnce(() => getMock(mockName))"
        );
        writer.writeLine("    : mockImplementationOnce(mockName);");
        writer.writeLine("newSpy.getMock = getMock;")
        writer.writeLine("return newSpy;");
      }
    });
  }

  private writeClassSpy(
    file: SourceFile,
    className: string,
    classTree: SingleClassMockTree
  ) {
    file.addVariableStatement({
      declarationKind: VariableDeclarationKind.Const,
      isExported: true,
      declarations: [
        {
          name: this.getSpyClassName(className),
          type: this.getSpyInterfaceName(className),
          initializer: writer => {
            writer.writeLine("{");
            Object.keys(classTree).map(methodName =>
              writer.writeLine(`    ${methodName}: getSpy("${methodName}"),`)
            );
            writer.writeLine("}");
          }
        }
      ]
    });
  }

  private getMethodsTypes(classTree: SingleClassMockTree) {
    return Object.keys(classTree).map(methodName => {
      const methodTree = classTree[methodName];
      const methodArgUnionType = this.getMethodArgUnionType(methodTree);
      return { name: methodName, type: `MockshotMock<${methodArgUnionType}>` };
    });
  }

  private getMethodArgUnionType(methodTree: {
    [mockName: string]: any;
  }): string {
    return Object.keys(methodTree)
      .map(mockName => `"${mockName}"`)
      .join(" | ");
  }

  private getSpyInterfaceName(className: string): string {
    return className + "Spy";
  }

  private getSpyClassName(className: string): string {
    return className.charAt(0).toLowerCase() + className.slice(1) + "Spy";
  }

  private getFilePath(filePath): string {
    return path.join("spies", filePath);
  }
}
