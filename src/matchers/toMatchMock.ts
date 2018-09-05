import { cloneDeep, get, set } from "lodash";
import pretty from "json-pretty";

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

export const ClassSnapshotTag = "[ClassSnap]";

expect.addSnapshotSerializer({
  test: val => val.mock,
  print: val => pretty(val)
});

function getSnapshotName(testName, snapshotTag: string) {
  // TODO: If there are more the 1 snapshots (indicated by the number at the end) throw an exception
  return `${testName}: ${snapshotTag} 1`;
}

function getSnapshotTag(
  className: string,
  methodName: string,
  mockName: string
) {
  const snapshotNameTag = `[mockshot] ${ClassSnapshotTag} [[${className} ${methodName} ${mockName}]]`;

  return snapshotNameTag;
}

let commonSnapshotState;

function toMatchMock(
  received,
  className: string,
  methodName: string,
  mockName: string,
  ignoredKeyPaths?: string[],
  customMatcher?: any
) {
  commonSnapshotState = this.snapshotState;

  const snapshotTag = getSnapshotTag(className, methodName, mockName);
  const snapshotName = getSnapshotName(this.currentTestName, snapshotTag);
  const currentSnapshot = this.snapshotState._snapshotData[snapshotName];

  if (ignoredKeyPaths && currentSnapshot) {
    const parsedSnapshot = JSON.parse(currentSnapshot);
    received = cloneDeep(received);

    ignoredKeyPaths.forEach(keyPath => {
      const val = get(parsedSnapshot.mock, keyPath);
      const target = get(received, keyPath);
      if (val && target && typeof val === typeof target) {
        set(received, keyPath, val);
      }
    });
  }
  const snapshot = { className, methodName, mockName, mock: received };
  const snapshotNameTag = `[${className} ${methodName} ${mockName}]`;
  const result = expect(snapshot).toMatchSnapshot(
    `[mockshot] [${snapshotNameTag}]`
  );
  const pass = result === undefined;
  return { pass };
}

expect.extend({ toMatchMock });

export { toMatchMock };
