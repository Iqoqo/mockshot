import "../src/matchers";

class HelloWorld {
  bar(mock: "success"): any {
    switch (mock) {
      case "success":
        return {
          "data": {
            "_id": "1234"
          },
          "id": "1234sddd56",
          "some": "value"
        }
      default:
        throw Error("Unknown mock: " + mock);
    }
  }

  foo(mock: "success"): any {
    switch (mock) {
      case "success":
        return {
          "foo": "barr"
        }
      default:
        return "unknown";
    }
  }
}

const hello = new HelloWorld();

describe("toMatchMock", () => {
  it("Should return correct schema", () => {
    expect(hello.foo("success")).toMatchMock(HelloWorld.name, "foo", "success");
  });

  it("Should match a default parameter", () => {
    expect(hello.foo("default-param")).toMatchMock(HelloWorld.name, "foo", "default-param");
  });

  it("Should match mock with ignoredKeyPaths", () => {
    expect(hello.bar("success")).toMatchMock(HelloWorld.name, "bar", "success", ["id", "data._id"]);
  });

});
