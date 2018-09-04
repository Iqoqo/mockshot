import { CodeBlockWriter, SourceFile } from "ts-simple-ast";
import pretty from "json-pretty";
import { MockGenerator } from "./base";

export class ClassGenerator extends MockGenerator {
  private mockDef: any = {};

  getFilename() {
    return "ClassMocks.ts";
  }

  generate(fileDecleration: SourceFile, snapshots: object) {
    const keys = Object.keys(snapshots);

    keys.forEach(key => this.parseSingleMock(snapshots[key]));

    const classNames = Object.keys(this.mockDef);

    classNames.forEach(className => {
      const mockClassName = className + "Mocks";

      const myClassFile = fileDecleration;

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

        classDeclaration.addProperty({
          isStatic: true,
          name: methodName
        });

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

  private parseSingleMock(snap) {
    const snapshot = JSON.parse(snap);
    let classDef = this.mockDef[snapshot.className];

    if (!classDef) {
      classDef = {};
      this.mockDef[snapshot.className] = classDef;
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
}
