import "../../src";
import { SomeClass } from "./SomeClass";

describe("SomeClass", () => {
    it("getSomeData should return the correct shape", () => {
        const instance = new SomeClass();
        const result = instance.getSomeData();

        expect(result).toMatchMock(SomeClass, "getSomeData", "success")
    })
})