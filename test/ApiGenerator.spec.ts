import { ApiGenerator } from "../src/generators/ApiGenerator";

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
];

describe("ApiGenerator", () => {
  it("should generate API endpoint mock", async () => {
    const generator = new ApiGenerator();
    const fileDeclaration = await generator.generate(snapshots);

    expect(fileDeclaration._compilerNode.text).toMatchSnapshot(
      "[API] [generator]"
    );
  });
});
