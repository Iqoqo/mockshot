import { ApiGenerator } from "../src/generators/ApiGenerator";
import { API as API2 } from "../API";

// API2.get("/hello/world").
// API2.get("/bye/world").

const dummySnapshot = [
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

const mockObj = {
  GET: {
    "/hello/world": { success: {}, fail: {} }
  }
};

describe("ApiGenerator", () => {
  it("should generate dummy API endpoint mock", async () => {
    const generator = new ApiGenerator(".");
    await generator.generate(dummySnapshot);
  });
});

export const API = {
  GET: (url: "/hello/world" | "/bye/world") => {
    switch (url) {
      case "/hello/world":
        return {
          success: { statusCode: 200, body: { foo: { bar: "123" } } }
        };
      case "/bye/world":
        return { statusCode: 501, error: "not implemented" };
    }
  }
};
