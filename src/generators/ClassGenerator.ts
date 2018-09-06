import { CodeBlockWriter, SourceFile } from "ts-simple-ast";
import pretty from "json-pretty";
import _ from "lodash";
import path from "path";

import { MockGenerator } from "./base";
import { ClassSnapshotTag } from "../matchers/contracts";
import { IClassSnapshot, ISnapshot } from "../contracts";

export class ClassGenerator extends MockGenerator {
  private mockDef: any = {};

  generate(
    getFile: (fileName: string) => SourceFile,
    allSnapshots: ISnapshot[]
  ) {
    const snapshots = allSnapshots.filter(snap =>
      _.includes(snap.key, ClassSnapshotTag)
    );
    snapshots.forEach(snap =>
      this.parseSingleMock(snap.data as IClassSnapshot, snap.packageName)
    );

    const classNames = Object.keys(this.mockDef);

    classNames.forEach(className => {
      const mockClassName = this.getMockClassName(className);

      const myClassFile = getFile(`${className}.ts`);

      const classDeclaration = myClassFile.addClass({
        name: mockClassName
      });

      classDeclaration.setIsExported(true);

      const methods = this.mockDef[className];

      const methodNames = Object.keys(methods);

      methodNames.forEach(methodName => {
        const mocks = methods[methodName];
        const mockNames = Object.keys(mocks);
        let mockTypes = mockNames.map(value => {
          return `"${value}"`;
        });
        const types = mockTypes.join(" | ");

        const method = classDeclaration.addMethod({
          isStatic: true,
          parameters: [{ name: "mock", type: types }],
          name: methodName,
          returnType: "any"
        });

        method.setBodyText(writer =>
          writer.write("switch (mock)").block(() => {
            mockNames.forEach(mockName => {
              writer.write(`case "${mockName}":`).indentBlock(() => {
                writer.write(`return ${pretty(mocks[mockName])}`);
              });
            });
            writer.write(`default:`).indentBlock(() => {
              writer.write(`throw Error("Unknown mock: "+mock);`);
            });
          })
        );
      });
    });
  }

  private parseSingleMock(snapshot: IClassSnapshot, packageName?: string) {
    const fullClassName = this.getFullClassName(
      snapshot.className,
      packageName
    );
    let classDef = this.mockDef[fullClassName];

    if (!classDef) {
      classDef = {};
      this.mockDef[fullClassName] = classDef;
    }

    let methodDef = classDef[snapshot.methodName];
    if (!methodDef) {
      methodDef = {};
      classDef[snapshot.methodName] = methodDef;
    }

    let mockName = methodDef[snapshot.mockName];
    if (!mockName) {
      methodDef[snapshot.mockName] = snapshot.mock;
    } else {
      throw Error(
        "Duplicate mock name for method " +
          snapshot.methodName +
          ": " +
          snapshot.mockName
      );
    }
  }
  private getFullClassName(className: string, packageName?: string): string {
    return packageName ? path.join(packageName, className) : className;
  }

  private getMockClassName(fullClassName: string): string {
    return `${path.basename(fullClassName)}Mocks`;
  }
}
