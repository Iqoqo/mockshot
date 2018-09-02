import "../src/toMatchMock";
import glob from "glob";
import path from "path";
import Project from "ts-simple-ast";
import fs from "fs";
import { SnapshotState } from "jest-snapshot";
class HelloWorld {
  foo() {
    return;
  }

  bar() {
    return { api: { data: "123" } };
  }
}

describe("toMatchMock", () => {
  beforeAll(() => {});

  it.only("Should return correct schema", () => {
    expect({ foo: "barr" }).toMatchMock(HelloWorld.name, "foo", "success");
  });

  it("Should create another method", () => {
    const hello = new HelloWorld();
    expect(hello.bar()).toMatchMock(HelloWorld.name, "bar", "success");
    expect({ error: "yes" }).toMatchMock(
      HelloWorld.name,
      "bar",
      "no-valid-params"
    );
  });

  it("Should match mock shape", () => {
    expect({
      some: "value",
      id: "1234sddd56",
      data: { _id: "1234" }
    }).toMatchMock(HelloWorld.name, "shape", "success", ["id", "data._id"]);
  });

  it.only("Should match api mock shape", () => {
    /*const res = axios.post(WebPath.login, data: {userid: "3", password: "4"});
    expect(res).toMatchAPIMock.POST(url).valid;
    {
      body: {
        token: "jwt xxx"
      },
      status: 200,
      headers: {
        auth: {
          token: "asdfasdasd"
        }
      }
    }

    HelloWorld.name, "shape", "success", ["id", "data._id"];*/
  });

  it.skip("Should generate mocks", async done => {
    const project = new Project({
      compilerOptions: { outDir: "dist/mocks", declaration: true }
    });

    glob("**/*.ts.mockshot", async function(er, files) {
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
        const mockFileName = `mocks/${className}Mock.ts`;

        let myClassFile;
        try {
          await fs.unlinkSync(mockFileName);
        } catch (ex) {
          console.log("No such file", mockFileName);
        }
        myClassFile = project.createSourceFile(mockFileName);

        const classDeclaration = myClassFile.addClass({
          name: className
        });

        const methods = mockDef[className];

        const methodNames = Object.keys(methods);

        methodNames.forEach(methodName => {
          const mocks = methods[methodName];
          const mockNames = Object.keys(mocks);
          let mockTypes = mockNames.map(value => {
            return `"${value}"`;
          });
          const types = mockTypes.join(" | ");
          console.log("types", types);
          const method = classDeclaration.addMethod({
            isStatic: true,
            parameters: [{ name: "mock", type: types }],
            name: methodName,
            returnType: "any"
          });

          method.setBodyText(writer =>
            writer.write("switch (mock)").block(() => {
              mockNames.forEach(mockName => {
                writer.writeLine(`case "${mockName}":`);
                writer.writeLine(`return ${JSON.stringify(mocks[mockName])}`);
              });
              writer.writeLine(`default:`);
              writer.writeLine(`throw Error("Unknown mock: "+mock);`);
            })
          );
        });
      });

      await project.save();

      await project.emit();
      done();
    });
  });
});
