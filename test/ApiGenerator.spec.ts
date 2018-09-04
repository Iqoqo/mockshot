import { Project } from "ts-simple-ast";
import { ApiGenerator } from "../src/generators/ApiGenerator";
import { IApiSnapshot } from "../src/matchers/toMatchAPIMock";

const snapshots = [
  {
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
  {
    url: "/hello/world",
    httpMethod: "post",
    mock: {
      statusCode: 501,
      error: "not implemented"
    },
    mockName: "fail"
  },
  {
    url: "/bye/world",
    httpMethod: "get",
    mock: {
      body: { foo: { bar: "123" } },
      statusCode: 200
    },
    mockName: "success"
  },
  {
    url: "/hello/world",
    httpMethod: "get",
    mock: {
      statusCode: 501,
      error: "not implemented!"
    },
    mockName: "fail"
  }
] as IApiSnapshot[];

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
