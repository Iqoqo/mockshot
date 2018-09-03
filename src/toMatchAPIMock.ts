import { cloneDeep, get, set } from "lodash";
import pretty from "json-pretty";
import { generateMocks } from "./generateMocks";

export enum HttpMethods {
  GET = "GET",
  POST = "POST",
  PUT = "PUT",
  PATCH = "PATCH",
  DELETE = "DELETE"
}

export const RequestModules = {
  request: "request",
  axios: "axios",
  r2: "r2",
  fetch: "fetch"
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

async function toMatchApiMock(
  received,
  requestModules,
  returnValue: string
) {
  commonSnapshotState = this.snapshotState;

  let url;
  let method;
  let mock;

  console.log(requestModules);
  switch (requestModules) {
    case RequestModules.axios:
      method = received.config.method.toUpperCase();
      url = received.url;
      mock = { status: received.status, body: received.data }
      break;
    case RequestModules.r2:
      const res = await received.response;
      console.log("in r2");
      console.log(res.url);
      console.log(res.status);
      console.log(received.opts.method);
      console.log(received);
      method = received.opts.method.toUpperCase();
      url = res.url;
      mock = { status: res.status, body: res.data }
      break;
    case RequestModules.fetch:  break;
    case RequestModules.request:
    default: break;
  }

const snapshotTag = getSnapshotTag(
  method, url, returnValue
);
const snapshotName = getSnapshotName(this.currentTestName, snapshotTag);
const currentSnapshot = this.snapshotState._snapshotData[snapshotName];

const snapshot = {
  method,
  url,
  mockName: returnValue,
  mock
};

const snapshotNameTag = `[${method} ${url} ${returnValue}]`;

const result = expect(snapshot).toMatchSnapshot(
  `[mockshot] [${snapshotNameTag}]`
);

const pass = result === undefined;

return { pass };
}

expect.extend({ toMatchApiMock });

export { toMatchApiMock };
