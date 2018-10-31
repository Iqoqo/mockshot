import stringify from 'json-stable-stringify';
import { toMatchApiMock } from "./ApiMockMatcher";
import { toMatchClassMock } from "./ClassMockMatcher";

declare global {
    namespace jest {
        // tslint:disable-next-line:interface-name
        interface Matchers<R> {
            toMatchClassMock(
                className: string,
                methodName: string,
                mockName: string,
                ignoredKeyPaths?: string[]
            ): R;
            toMatchApiMock(
                response: object,
                mockName: string,
            ): R;
        }
    }
}

expect.addSnapshotSerializer({
    test: val => val.mock,
    print: val => stringify(val, { space: '  ' })
});

const toMatchMock = toMatchClassMock

expect.extend({ toMatchMock, toMatchClassMock, toMatchApiMock });

export { toMatchMock, toMatchClassMock, toMatchApiMock };
