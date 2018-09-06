import Project, { SourceFile } from "ts-simple-ast";
import { ApiGenerator } from "../../src/generators";
import { IApiSnapshot, ApiSnapshotTag } from "../../src/matchers";
import { ISnapshot } from "../../src/contracts";

const snapshots: ISnapshot[] = [
  {
    key: `${ApiSnapshotTag} 1`,
    filePath: "./test/generators/ApiGenerator.spec.ts",
    data: {
      url: "/hello/world",
      httpMethod: "post",
      mock: {
        statusCode: 200,
        body: {
          foo: {
            bar: "123"
          }
        }
      },
      mockName: "success"
    }
  },
  {
    key: `${ApiSnapshotTag} 2`,
    filePath: "./test/generators/ApiGenerator.spec.ts",
    data: {
      url: "/hello/world",
      httpMethod: "post",
      mock: {
        statusCode: 501,
        error: "not implemented",
        body: ""
      },
      mockName: "fail"
    }
  },
  {
    key: `${ApiSnapshotTag} 3`,
    filePath: "./test/generators/ApiGenerator.spec.ts",
    data: {
      url: "/bye/world",
      httpMethod: "get",
      mock: {
        body: { foo: { bar: "123" } },
        statusCode: 200
      },
      mockName: "success"
    }
  },
  {
    key: `${ApiSnapshotTag} 4`,
    filePath: "./test/generators/ApiGenerator.spec.ts",
    data: {
      url: "/hello/world",
      httpMethod: "get",
      mock: {
        statusCode: 501,
        error: "not implemented!",
        body: ""
      },
      mockName: "fail"
    }
  }
];

const snapshotsMissingName = [
  ...snapshots,
  {
    key: `${ApiSnapshotTag} 5`,
    filePath: "./test/generators/ApiGenerator.spec.ts",
    data: {
      url: "/hello/world/2",
      httpMethod: "get",
      mock: {
        statusCode: 501,
        error: "not implemented!"
      }
    }
  }
];

const snapshotsMissingUrl = [
  ...snapshots,
  {
    key: `${ApiSnapshotTag} 5`,
    filePath: "./test/generators/ApiGenerator.spec.ts",
    data: {
      httpMethod: "get",
      mock: {
        statusCode: 501,
        error: "not implemented!"
      },
      mockName: "fail"
    }
  }
];

const snapshotsInvalidMethod = [
  ...snapshots,
  {
    key: `${ApiSnapshotTag} 5`,
    filePath: "./test/generators/ApiGenerator.spec.ts",
    data: {
      url: "/hello/world/2",
      httpMethod: "take",
      mock: {
        statusCode: 501,
        error: "not implemented!"
      },
      mockName: "fail"
    }
  }
];

const snapshotsMissingStatus = [
  ...snapshots,
  {
    key: `${ApiSnapshotTag} 5`,
    filePath: "./test/generators/ApiGenerator.spec.ts",
    data: {
      url: "/hello/world/2",
      httpMethod: "get",
      mock: {
        error: "not implemented!"
      },
      mockName: "fail"
    }
  }
];

const snapshotsMissingMock = [
  ...snapshots,
  {
    key: `${ApiSnapshotTag} 5`,
    filePath: "./test/generators/ApiGenerator.spec.ts",
    data: {
      url: "/hello/world/2",
      httpMethod: "get",
      mockName: "fail"
    }
  }
];

const snapshotsDuplication = [
  ...snapshots,
  {
    ...snapshots[0],
    key: `${ApiSnapshotTag} dup`
  }
];

describe("ApiGenerator", () => {
  let generator: ApiGenerator;
  let getFile;

  beforeEach(() => {
    const project = new Project();
    getFile = () => project.createSourceFile("api");
    generator = new ApiGenerator();
  });

  it("Should throw if snapshot is missing mockName", () => {
    expect(() =>
      generator.generate(getFile, snapshotsMissingName)
    ).toThrowError();
  });

  it("Should throw if snapshot is missing url", () => {
    expect(() => generator.generate(getFile, snapshotsMissingUrl)).toThrowError(
      "Missing property url in snapshot '[APISnap] 5'"
    );
  });

  it("Should throw if snapshot has invalid HTTP method", () => {
    expect(() =>
      generator.generate(getFile, snapshotsInvalidMethod)
    ).toThrowError("Invalid http method 'take' in snapshot '[APISnap] 5'");
  });

  it("Should throw if snapshot is missing status code", () => {
    expect(() =>
      generator.generate(getFile, snapshotsMissingStatus)
    ).toThrowError("Missing property statusCode in snapshot '[APISnap] 5'");
  });

  it("Should throw if snapshot is missing mock property", () => {
    expect(() =>
      generator.generate(getFile, snapshotsMissingMock)
    ).toThrowError("Missing property mock in snapshot '[APISnap] 5'");
  });

  it("Should throw if snapshot has duplicate mocks", () => {
    expect(() =>
      generator.generate(getFile, snapshotsDuplication)
    ).toThrowError(
      "Snapshot duplication: snapshot with the same httpMethod, URL and mockName already exists '[APISnap] dup'"
    );
  });

  it("Should generate API endpoint mock", () => {
    const fileDeclaration = generator.generate(getFile, snapshots);

    expect(fileDeclaration._compilerNode.text).toMatchSnapshot(
      "[API] [generator]"
    );
  });
});
