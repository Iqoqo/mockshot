import {glob} from "glob";
import * as path from "path";
import Project from "ts-simple-ast";
import fs from "fs";
import { SnapshotState } from "jest-snapshot";
import pretty from 'json-pretty'

export async function generateMocks() {
  const project = new Project({
    compilerOptions: { outDir: "dist/mocks", declaration: true }
  });

  glob("**/*.snap", async function(er, files) {
    // files is an array of filenames.
    // If the `nonull` option is set, and nothing
    // was found, then files is ["**/*.js"]
    // er is an error object or null.
    const mockDef = {} as any;

    files.forEach(file => {
      const absolutePath = path.resolve(file);
      const state = new SnapshotState(absolutePath, {
        snapshotPath: absolutePath
      });
      const data = state._snapshotData;
      const keys = Object.keys(data);

      keys.forEach(async key => {
        if (key.indexOf("[mockshot]") < 0) {
          return;
        }
        const snapshot = JSON.parse(state._snapshotData[key]);
        let classDef = mockDef[snapshot.className];
        if (!classDef) {
          classDef = {};
          mockDef[snapshot.className] = classDef;
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
      });
    });

    const classNames = Object.keys(mockDef);
    classNames.forEach(async className => {
      const mockClassName = className+'Mocks';

      console.log('Creating class', mockClassName);

      const mockFileName = `mocks/${mockClassName}.ts`;

      let myClassFile;
      try {
        await fs.unlinkSync(mockFileName);
        console.log("File exists", mockFileName, "removing...");
      } catch (ex) {
      }

      myClassFile = project.createSourceFile(mockFileName);

      const classDeclaration = myClassFile.addClass({
        name: mockClassName
      });

      classDeclaration.setIsExported(true);

      const methods = mockDef[className];

      const methodNames = Object.keys(methods);

      methodNames.forEach(methodName => {
        console.log('Creating method mocks', methodName);

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
              writer.write(`case "${mockName}":`).indentBlock(()=>{
                writer.write(`return ${pretty(mocks[mockName])}`);
              })
            });
            writer.write(`default:`).indentBlock(()=>{
              writer.write(`throw Error("Unknown mock: "+mock);`);
            })
          })
        );
      });
    });

    await project.save();

    console.log('Saved Typescript source...emitting vanilla js');
    await project.emit();
    console.log('Done!');
  });
}
