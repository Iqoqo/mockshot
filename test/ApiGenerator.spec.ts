import Project from "ts-simple-ast";
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

describe("ApiGenerator", () => {
  it("should generate API endpoint mock", async () => {
    const generator = new ApiGenerator();
    const project = new Project();
    const fileDeclaration = project.createSourceFile("api");
    await generator.generate(fileDeclaration, snapshots);

    expect(fileDeclaration._compilerNode.text).toMatchSnapshot(
      "[API] [generator]"
    );
  });
});
