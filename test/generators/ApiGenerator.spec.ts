import Project, { SourceFile } from "ts-simple-ast";
import { ApiGenerator } from "../../src/generators";
import { IApiSnapshot, ApiSnapshotTag } from "../../src/matchers";

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

  it("Should throw if snapshot is missing mockName", () => {
    expect(() =>
      generator.generate(fileDeclaration, snapshotsMissingName)
    ).toThrowError();
  });

  it("Should throw if snapshot is missing url", () => {
    expect(() =>
      generator.generate(fileDeclaration, snapshotsMissingUrl)
    ).toThrowError("Missing property url in snapshot '[APISnap] 5'");
  });

  it("Should throw if snapshot has invalid HTTP method", () => {
    expect(() =>
      generator.generate(fileDeclaration, snapshotsInvalidMethod)
    ).toThrowError("Invalid http method 'take' in snapshot '[APISnap] 5'");
  });

  it("Should throw if snapshot is missing status code", () => {
    expect(() =>
      generator.generate(fileDeclaration, snapshotsMissingStatus)
    ).toThrowError("Missing property statusCode in snapshot '[APISnap] 5'");
  });

  it("Should throw if snapshot is missing mock property", () => {
    expect(() =>
      generator.generate(fileDeclaration, snapshotsMissingMock)
    ).toThrowError("Missing property mock in snapshot '[APISnap] 5'");
  });

  it("Should throw if snapshot has duplicate mocks", () => {
    expect(() =>
      generator.generate(fileDeclaration, snapshotsDuplication)
    ).toThrowError(
      "Snapshot duplication: snapshot with the same httpMethod, URL and mockName already exists '[APISnap] dup'"
    );
  });

  it("Should generate API endpoint mock", () => {
    generator.generate(fileDeclaration, snapshots);

    expect(fileDeclaration._compilerNode.text).toMatchSnapshot(
      "[API] [generator]"
    );
  });
});
