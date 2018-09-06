import { get, set } from "lodash";
import { ClassSnapshotTag } from "./contracts"


export function toMatchClassMock(
    mock,
    className: string,
    methodName: string,
    mockName: string,
    ignoredKeyPaths?: string[]
): { message(): string | (() => string); pass: boolean; } {
    const snapshotTag = `[mockshot] ${ClassSnapshotTag} [[${className} ${methodName} ${mockName}]]`;
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

    return { pass: undefined === expect(snapshot).toMatchSnapshot(snapshotTag), message: () => `expected ${snapshot} to match tag ${snapshotTag}` };
}