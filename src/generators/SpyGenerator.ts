import stringify from "json-stable-stringify";
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
      const file = getFile(filePath);
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
  }

  private writeMockshotMockInterface(file: SourceFile) {
    file.addInterface({
      name: "MockshotMock<P, T = {}>",
      extends: ["jest.Mock"],
      properties: [
        { name: "give", type: "(mockName: P) => jest.Mock<T>" },
        { name: "giveOnce", type: "(mockName: P) => jest.Mock<T>" }
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
          "const getMock = mockName => classTree[methodName][mockName].mock"
        );
        writer.writeLine(
          "newSpy.give = mockName => newSpy.mockImplementation("
        );
        writer.writeLine("    () => getMock(mockName)");
        writer.writeLine(");");
        writer.writeLine(
          "newSpy.giveOnce = mockName => newSpy.mockImplementationOnce("
        );
        writer.writeLine("    () => getMock(mockName)");
        writer.writeLine(");");
      }
    });
  }

  private getMethodsTypes(classTree: SingleClassMockTree) {
    return Object.keys(classTree).map(methodName => {
      const methodTree = classTree[methodName];
      const methodArgUnionType = this.getMethodArgUnionType(methodTree);
      return { name: methodName, type: `MockshotMock<${methodArgUnionType}>` };
    });
  }

  private getMethodArgUnionType(methodTree: { [mockName: string]: any }) {
    return Object.keys(methodTree)
      .map(mockName => `"${mockName}"`)
      .join(" | ");
  }
}

interface MockshotMock<P, T = {}> extends jest.Mock {
  give: (mockName: P) => jest.Mock<T>;
  giveOnce: (mockName: P) => jest.Mock<T>;
}
interface JobActionsServiceSpy {
  duplicateJob: MockshotMock<"success" | "fail">;
}

function getSpy<P extends string>(methodName) {
  const newSpy = jest.fn() as MockshotMock<P>;
  newSpy.give = mockName =>
    newSpy.mockImplementation(() =>
      JobActionsServiceMocks[methodName](mockName)
    );
  newSpy.giveOnce = mockName =>
    newSpy.mockImplementationOnce(() =>
      JobActionsServiceMocks[methodName](mockName)
    );
  return newSpy;
}

export const jobActionsServiceSpy: JobActionsServiceSpy = {
  duplicateJob: getSpy("duplicateJob")
};

jobActionsServiceSpy.duplicateJob.give("success");
jobActionsServiceSpy.duplicateJob.giveOnce("fail");
