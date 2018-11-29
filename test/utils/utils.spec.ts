import "../../src/matchers";
import { getOwnSnapshots } from "./index";

describe("getOwnSnapshots", () => {
  const className = "fakeClass";
  const methodName = "fakeMethod";
  const mockName = "fakeMock";
  const someObject = {
    hello: "world",
    foo: { bar: "buzz" }
  };

  it("should generate a snapshot", () => {
    expect(someObject).toMatchClassMock(className, methodName, mockName);
  });

  it("read the snapshot correctly", () => {
    const ownSnapshots = getOwnSnapshots(__filename);
    expect(ownSnapshots).toHaveLength(1);
    expect(ownSnapshots[0].data).toEqual({
      className,
      methodName,
      mockName,
      mock: someObject
    });
    expect(ownSnapshots[0].packageName).toBe("mockshot");
    expect(ownSnapshots[0].key).toBe(
      "getOwnSnapshots should generate a snapshot: [mockshot] [ClassSnap] [[fakeClass fakeMethod fakeMock]] 1"
    );
    expect(ownSnapshots[0].filePath).toBe(
      "/Users/idan/Documents/projects/mockshot/test/utils/__snapshots__/utils.spec.ts.snap"
    );
  });
});
