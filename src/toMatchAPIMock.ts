import { cloneDeep, get, set } from "lodash";
import pretty from "json-pretty";
import { generateMocks } from "./generateMocks";

declare global {
  namespace jest {
    // tslint:disable-next-line:interface-name
    interface Matchers<R> {
      toMatchAPIMock(mockName: string, ignoredKeyPaths?: string[]): R;
    }
  }
}

export enum HttpMethods {
  GET = "GET",
  POST = "POST",
  PUT = "PUT",
  PATCH = "PATCH",
  DELETE = "DELETE"
}

expect.addSnapshotSerializer({
  test: val => val.mock,
  print: val => pretty(val)
});

function getSnapshotName(testName, snapshotTag: string) {
  // TODO: If there are more the 1 snapshots (indicated by the number at the end) throw an exception
  return `${testName}: ${snapshotTag} 1`;
}

function getSnapshotTag(
  methodName: HttpMethods,
  url: string,
  mockName: string
) {
  return `[mockshot] [[${methodName} ${url} ${mockName}]]`;
}

let commonSnapshotState;

afterAll(async () => {
  if (
    commonSnapshotState &&
    (commonSnapshotState.added > 0 || commonSnapshotState.updated > 0)
  ) {
    await generateMocks();
  }
});

function toMatchAPIMock(
  received,
  returnValue: string,
  ignoredKeyPaths?: string[],
  customMatcher?: any
) {
  commonSnapshotState = this.snapshotState;

  const snapshotTag = getSnapshotTag(
    received.config.method.toUpperCase(),
    received.url,
    returnValue
  );
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
  const snapshot = {
    method: received.config.method.toUpperCase(),
    url: received.config.url,
    mockName: returnValue,
    mock: received
  };
  const snapshotNameTag = `[${received.config.method.toUpperCase()} ${
    received.url
  } ${returnValue}]`;
  const result = expect(snapshot).toMatchSnapshot(
    `[mockshot] [${snapshotNameTag}]`
  );
  const pass = result === undefined;
  return { pass };
}

expect.extend({ toMatchAPIMock });

export { toMatchAPIMock };
