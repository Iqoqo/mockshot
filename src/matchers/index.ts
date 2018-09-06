import pretty from "json-pretty";
import ApiMockMatcher from "./ApiMockMatcher";
import ClassMockMatcher from "./ClassMockMatcher";

declare global {
    namespace jest {
        // tslint:disable-next-line:interface-name
        interface Matchers<R> {
            toMatchMock(
                className: string,
                methodName: string,
                mockName: string,
                ignoredKeyPaths?: string[]
            ): R;
        }
    }
}

expect.addSnapshotSerializer({
    test: val => val.mock,
    print: val => pretty(val)
});

const toMatchClassMock = ClassMockMatcher.toMatchMock
const toMatchApiMock = ApiMockMatcher.toMatchApiMock
const toMatchMock = toMatchClassMock

expect.extend({ toMatchMock, toMatchClassMock, toMatchApiMock });

export { toMatchMock, toMatchClassMock, toMatchApiMock };
export * from "./contracts"
