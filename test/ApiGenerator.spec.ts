import { ApiGenerator } from "../src/generators/ApiGenerator";

const snapshot = [
  {
    url: "/hello/world",
    httpMethod: "post",
    statusCode: 200,
    body: {
      foo: {
        bar: "123"
      }
    },
    mockName: "success"
  },
  {
    url: "/hello/world",
    httpMethod: "post",
    statusCode: 501,
    error: "not implemented",
    mockName: "fail"
  },
  {
    url: "/bye/world",
    httpMethod: "get",
    statusCode: 200,
    body: {
      foo: {
        bar: "123"
      }
    },
    mockName: "success"
  },
  {
    url: "/hello/world",
    httpMethod: "get",
    statusCode: 501,
    error: "not implemented!",
    mockName: "fail"
  }
];

describe("ApiGenerator", () => {
  it("should generate API endpoint mock", async () => {
    const generator = new ApiGenerator();
    const fileDeclaration = await generator.generate(snapshot);

    expect(fileDeclaration._compilerNode.text).toMatchSnapshot("[API] [generator]")
  });
});