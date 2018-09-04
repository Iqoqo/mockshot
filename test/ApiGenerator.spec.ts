import Project, { SourceFile } from "ts-simple-ast";
import { ApiGenerator } from "../src/generators/ApiGenerator";
import { IApiSnapshot, ApiSnapshotTag } from "../src/matchers/toMatchAPIMock";

const snapshots = {
  [`${ApiSnapshotTag} 1`]: {
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
  },
  [`${ApiSnapshotTag} 2`]: {
    url: "/hello/world",
    httpMethod: "post",
    mock: {
      statusCode: 501,
      error: "not implemented"
    },
    mockName: "fail"
  },
  [`${ApiSnapshotTag} 3`]: {
    url: "/bye/world",
    httpMethod: "get",
    mock: {
      body: { foo: { bar: "123" } },
      statusCode: 200
    },
    mockName: "success"
  },
  [`${ApiSnapshotTag} 4`]: {
    url: "/hello/world",
    httpMethod: "get",
    mock: {
      statusCode: 501,
      error: "not implemented!"
    },
    mockName: "fail"
  }
} as { [key: string]: IApiSnapshot };

const snapshotsMissingName = {
  ...snapshots,
  [`${ApiSnapshotTag} 5`]: {
    url: "/hello/world/2",
    httpMethod: "get",
    mock: {
      statusCode: 501,
      error: "not implemented!"
    }
  }
};

const snapshotsMissingUrl = {
  ...snapshots,
  [`${ApiSnapshotTag} 5`]: {
    httpMethod: "get",
    mock: {
      statusCode: 501,
      error: "not implemented!"
    },
    mockName: "fail"
  }
};

const snapshotsInvalidMethod = {
  ...snapshots,
  [`${ApiSnapshotTag} 5`]: {
    url: "/hello/world/2",
    httpMethod: "take",
    mock: {
      statusCode: 501,
      error: "not implemented!"
    },
    mockName: "fail"
  }
};

const snapshotsMissingStatus = {
  ...snapshots,
  [`${ApiSnapshotTag} 5`]: {
    url: "/hello/world/2",
    httpMethod: "get",
    mock: {
      error: "not implemented!"
    },
    mockName: "fail"
  }
};

const snapshotsMissingMock = {
  ...snapshots,
  [`${ApiSnapshotTag} 5`]: {
    url: "/hello/world/2",
    httpMethod: "get",
    mockName: "fail"
  }
};

const snapshotsDuplication = {
  ...snapshots,
  [`${ApiSnapshotTag} dup`]: snapshots[Object.keys(snapshots)[0]]
};

describe("ApiGenerator", () => {
  let fileDeclaration: SourceFile;
  let generator: ApiGenerator;

  beforeEach(() => {
    const project = new Project();
    fileDeclaration = project.createSourceFile("api");
    generator = new ApiGenerator();
  });

  it("should throw if snapshot is missing mockName", async () => {
    expect(
      await generator.generate(fileDeclaration, snapshotsMissingName)
    ).toThrowError();
  });

  it("should throw if snapshot is missing url", async () => {
    expect(
      await generator.generate(fileDeclaration, snapshotsMissingUrl)
    ).toThrowError();
  });

  it("should throw if snapshot has invalid HTTP method", async () => {
    expect(
      await generator.generate(fileDeclaration, snapshotsInvalidMethod)
    ).toThrowError();
  });

  it("should throw if snapshot is missing status code", async () => {
    expect(
      await generator.generate(fileDeclaration, snapshotsMissingStatus)
    ).toThrowError();
  });

  it("should throw if snapshot is missing mock property", async () => {
    expect(
      await generator.generate(fileDeclaration, snapshotsMissingMock)
    ).toThrowError();
  });

  it("should throw if snapshot has duplicate mocks", async () => {
    expect(
      await generator.generate(fileDeclaration, snapshotsDuplication)
    ).toThrowError();
  });

  it("should generate API endpoint mock", async () => {
    await generator.generate(fileDeclaration, snapshots);

    expect(fileDeclaration._compilerNode.text).toMatchSnapshot(
      "[API] [generator]"
    );
  });
});
