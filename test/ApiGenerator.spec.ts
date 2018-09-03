import { ApiGenerator } from "../src/generators/ApiGenerator";
import { API as API2 } from "../API";
const util = require('util')


// API2.get("/hello/world").
// API2.post("/hello/world").success

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
    const generator = new ApiGenerator(".");
    await generator.generate(snapshot); \
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
