import { get, set } from "lodash";

export default class ClassMockMatcher {

    static toMatchMock(
        mock,
        className: string,
        methodName: string,
        mockName: string,
        ignoredKeyPaths?: string[]
    ) {
        const snapshotTag = `[mockshot] [[${className} ${methodName} ${mockName}]]`;
        const snapshotName = `${this.currentTestName}: ${snapshotTag} 1`;
        const currentSnapshot = this.snapshotState._snapshotData[snapshotName];

        if (ignoredKeyPaths && currentSnapshot) {
            const parsedSnapshot = JSON.parse(currentSnapshot);

            ignoredKeyPaths.forEach(keyPath => {
                const val = get(parsedSnapshot.mock, keyPath);
                const target = get(mock, keyPath);
                if (val && target && typeof val === typeof target) {
                    set(mock, keyPath, val);
                }
            });
        }

        const snapshot = { className, methodName, mockName, mock };
        const snapshotNameTag = `[${className} ${methodName} ${mockName}]`;

        const result = expect(snapshot).toMatchSnapshot(
            `[mockshot] [${snapshotNameTag}]`
        );
        const pass = result === undefined;
        return { pass };
    }
}