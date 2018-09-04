import { cloneDeep, get, set } from "lodash";
import pretty from "json-pretty";
import { generateMocks } from "../generateMocks";

export enum HttpMethods {
  GET = "GET",
  POST = "POST",
  PUT = "PUT",
  PATCH = "PATCH",
  DELETE = "DELETE"
}

export enum RequestModules {
  request = "request",
  axios = "axios"
}

export interface IApiSnapshot {
  mockName: string;
  url: string;
  httpMethod: "post" | "get" | "put" | "delete" | "patch";
  mock: {
    statusCode: number;
    body: any;
    error?: string;
  };
}

export const ApiSnapshotTag = "[APISnap]";

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

function toMatchApiMock(received, returnValue: string) {
  commonSnapshotState = this.snapshotState;

  const snapshotTag = getSnapshotTag(
    received.config.method.toUpperCase(),
    received.url,
    returnValue
  );
  const snapshotName = getSnapshotName(this.currentTestName, snapshotTag);
  const currentSnapshot = this.snapshotState._snapshotData[snapshotName];

  const snapshot = {
    httpMethod: received.config.method.toUpperCase(),
    url: received.config.url,
    mockName: returnValue,
    mock: { statusCode: received.status, body: received.data }
  };

  const snapshotNameTag = `[${received.config.method.toUpperCase()} ${
    received.config.url
  } ${returnValue}]`;

  const result = expect(snapshot).toMatchSnapshot(
    `[mockshot] ${ApiSnapshotTag} [${snapshotNameTag}]`
  );

  const pass = result === undefined;

  return { pass };
}

expect.extend({ toMatchApiMock });

export { toMatchApiMock };
