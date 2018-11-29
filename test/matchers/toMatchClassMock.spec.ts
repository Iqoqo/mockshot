import { cloneDeep } from "lodash";
import "../../src";
import { getOwnSnapshots } from "../utils";

class TestClass {
  sayHello(name: string) {
    return `hello, ${name}`;
  }

  getSomeObject() {
    return { foo: "bar", fizz: { bizz: "buzz" } };
  }

  getTimeObj() {
    return { time: new Date(), hey: "ho!" };
  }

  getArray() {
    return ["a", new Date(), "c", ["d", new Date()]];
  }
}

const getSnapshot = key =>
  getOwnSnapshots(__filename).find(snap => snap.key.includes(key));

describe("Class mock matcher", () => {
  const myClass = new TestClass();

  it("should create a mock with correct data and metadata ~1~", () => {
    const result = myClass.getSomeObject();

    expect(result).toMatchClassMock("TestClass", "getSomeObject", "ok");

    const { data } = getSnapshot("~1~");

    expect(data.mock).toEqual(result);
    expect(data.className).toBe("TestClass");
    expect(data.methodName).toBe("getSomeObject");
    expect(data.mockName).toBe("ok");
  });

  it("should create a mock with default mockName ~2~", () => {
    const result = myClass.getSomeObject();

    expect(result).toMatchClassMock("TestClass", "getSomeObject");

    const { data } = getSnapshot("~2~");

    expect(data.mock).toEqual(result);
    expect(data.className).toBe("TestClass");
    expect(data.methodName).toBe("getSomeObject");
    expect(data.mockName).toBe("success");
  });

  it("should extract class name from instance ~3~", () => {
    const result = myClass.getSomeObject();

    expect(result).toMatchClassMock(myClass, "getSomeObject", "ok");

    const { data } = getSnapshot("~3~");

    expect(data.mock).toEqual(result);
    expect(data.className).toBe("TestClass");
    expect(data.methodName).toBe("getSomeObject");
    expect(data.mockName).toBe("ok");
  });

  it("should ignore fields ~4~", () => {
    const result = myClass.getTimeObj();

    expect(result).toMatchClassMock(myClass, "getTimeObj", "ok", ["time"]);

    const { data } = getSnapshot("~4~");

    expect(data.mock.hey).toEqual(result.hey);
    expect(data.mock.time).not.toEqual(result.time);
    expect(data.className).toBe("TestClass");
    expect(data.methodName).toBe("getTimeObj");
    expect(data.mockName).toBe("ok");
  });

  it("should ignore fields without a mockName ~5~", () => {
    const result = myClass.getTimeObj();

    expect(result).toMatchClassMock(myClass, "getTimeObj", ["time"]);

    const { data } = getSnapshot("~5~");

    expect(data.mock.hey).toEqual(result.hey);
    expect(data.mock.time).not.toEqual(result.time);
    expect(data.className).toBe("TestClass");
    expect(data.methodName).toBe("getTimeObj");
    expect(data.mockName).toBe("success");
  });

  it("should not mutate result while ignoring fields ~6~", () => {
    const result = myClass.getTimeObj();
    const originalTimestamp = result.time;

    expect(result).toMatchClassMock(myClass, "getTimeObj", "ok", ["time"]);

    const { data } = getSnapshot("~6~");

    expect(result.time).toEqual(originalTimestamp);
    expect(data.mock.time).not.toEqual(result.time);
  });

  it("should generate basic mock ~7~", () => {
    const result = myClass.sayHello("Idan");

    expect(result).toMatchClassMock(myClass, "sayHello");

    const { data } = getSnapshot("~7~");

    expect(data.mock).toEqual(result);
    expect(data.className).toBe("TestClass");
    expect(data.methodName).toBe("sayHello");
    expect(data.mockName).toBe("success");
  });

  it("should ignore nested fields ~8~", () => {
    const result = myClass.getArray();
    const clonedResult = cloneDeep(result);

    expect(result).toMatchClassMock(myClass, "getArray", ["1", "3.1"]);

    const { data } = getSnapshot("~8~");

    expect(data.mock[0]).toEqual(clonedResult[0]);
    expect(data.mock[1]).not.toEqual(clonedResult[1]);
    expect(data.mock[2]).toEqual(clonedResult[2]);
    expect(data.mock[3][0]).toEqual(clonedResult[3][0]);
    expect(data.mock[3][1]).not.toEqual(clonedResult[3][1]);
    expect(data.className).toBe("TestClass");
    expect(data.methodName).toBe("getArray");
    expect(data.mockName).toBe("success");
  });
});
