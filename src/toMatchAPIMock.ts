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

  switch (requestModules) {
    case RequestModules.r2:
      const res = await received.response;
      method = received.opts.method.toUpperCase();
      url = res.url;
      mock = { status: res.status, body: res.body }
      break;
    case RequestModules.axios:
    default:
      method = received.config.method.toUpperCase();
      url = received.url;
      mock = { status: received.status, body: received.data }
      break;
  }

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
