import Project from "ts-simple-ast";
import path from "path";
import { ClassSpyGenerator } from "../../src/generators/SpyGenerator";

describe("SpyGenerator", () => {
  let generator: ClassSpyGenerator;
  let project: Project;
  let getFile;

  beforeEach(() => {
    project = new Project();
    getFile = filePath =>
      project.createSourceFile(path.join(__dirname, "__testmocks__", filePath));
    generator = new ClassSpyGenerator();
  });

  it.skip("should work", () => {
    const snapshots = [mockSnapObjectA, mockSnapObjectB, mockSnapObjectC];
    const fileDecleration = generator.generate(getFile, snapshots);
    project.saveSync();
  });
});

const mockSnapObjectA = {
  key: "Class mock: [mockshot] [ClassSnap] [[TestClass getSomeObject ok]] 1",
  packageName: "mockshot",
  filePath: "/projects/mockshot/test/__snapshots__/index.spec.ts.snap",
  data: {
    className: "UserService",
    methodName: "getUser",
    mockName: "success",
    mock: { userName: "john", email: "john@google.com" }
  }
};

const mockSnapObjectB = {
  key: "Class mock: [mockshot] [ClassSnap] [[TestClass getSomeObject ok]] 1",
  packageName: "mockshot",
  filePath: "/projects/mockshot/test/__snapshots__/index.spec.ts.snap",
  data: {
    className: "UserService",
    methodName: "getUsers",
    mockName: "success",
    mock: [{ userName: "john", email: "john@google.com" }]
  }
};

const mockSnapObjectC = {
  key: "Class mock: [mockshot] [ClassSnap] [[TestClass getSomeObject ok]] 1",
  packageName: "mockshot",
  filePath: "/projects/mockshot/test/__snapshots__/index.spec.ts.snap",
  data: {
    className: "UserService",
    methodName: "getUser",
    mockName: "fail",
    mock: "user could not be found"
  }
};

const mockSnapObjectD = {
  key: "Class mock: [mockshot] [ClassSnap] [[TestClass getSomeObject ok]] 1",
  packageName: "jest",
  filePath: "/projects/mockshot/test/__snapshots__/index.spec.ts.snap",
  data: {
    className: "UserService",
    methodName: "getUser",
    mockName: "success",
    mock: { userName: "john", email: "john@google.com" }
  }
};

const mockSnapObjectNoPackage = {
  key: "Class mock: [mockshot] [ClassSnap] [[TestClass getSomeObject ok]] 1",
  filePath: "/projects/mockshot/test/__snapshots__/index.spec.ts.snap",
  data: {
    className: "UserService",
    methodName: "getUser",
    mockName: "success",
    mock: { userName: "john", email: "john@google.com" }
  }
};
