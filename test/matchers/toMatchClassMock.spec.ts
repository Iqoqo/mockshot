import "../../src/matchers";

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

  complexArray(mock: "complexArray1" | "complexArray2" | "complexArray3"): any {
    switch (mock) {
      case "complexArray1": {
        return {
          "data": [{ "id": 999 }, { "id": 567 }]
        }
      }
      case "complexArray2": {
        return {
          "data": {
            "level1": [{ "id": 123 }, { "id": 456 }]
          }
        }
      }
      case "complexArray3": {
        return {
          "data": [{
            "level1": [{ "id": 123 }, { "id": 456 }]
          }, {
            "level1": [{ "id": 789 }]
          }]
        }
      }
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

  it.only("Should igone fields within an array", () => {
    expect(hello.complexArray("complexArray1")).toMatchMock(HelloWorld.name, "complexArray", "complexArray1", ["data[id]"]);
    //NOT SUPPORTED YET
    // expect(hello.complexArray("complexArray2")).toMatchMock(HelloWorld.name, "complexArray", "complexArray2", ["data.level1[id]"]);
    // expect(hello.complexArray("complexArray3")).toMatchMock(HelloWorld.name, "complexArray", "complexArray3", ["data[level1[id]]"]);
  })

});
