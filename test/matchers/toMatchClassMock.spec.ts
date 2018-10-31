import "../../src/matchers";

class HelloWorld {
  bar(mock: "success"): any {
    switch (mock) {
      case "success":
        return {
          data: {
            _id: "1234"
          },
          nullParam: null,
          undefinedlParam: undefined,
          id: "1234sddd56",
          some: "value",
          timestamp: new Date()
        };
      default:
        throw Error("Unknown mock: " + mock);
    }
  }

  foo(mock: "success"): any {
    switch (mock) {
      case "success":
        return {
          foo: "barr"
        };
      default:
        return "unknown";
    }
  }
}

const hello = new HelloWorld();

describe("toMatchMock", () => {
  it("Should return correct schema", () => {
    expect(hello.foo("success")).toMatchClassMock(
      HelloWorld.name,
      "foo",
      "success"
    );
  });

  it("Should match a default parameter", () => {
    expect(hello.foo("default-param")).toMatchClassMock(
      HelloWorld.name,
      "foo",
      "default-param"
    );
  });

  it("Should match mock with ignoredKeyPaths", () => {
    expect(hello.bar("success")).toMatchClassMock(
      HelloWorld.name,
      "bar",
      "success",
      ["id", "data._id", "timestamp"]
    );
  });
});
