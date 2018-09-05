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

expect.addSnapshotSerializer({
  test: val => val.mock,
  print: val => pretty(val)
});

function toMatchMock(
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

expect.extend({ toMatchMock });

export { toMatchMock };
