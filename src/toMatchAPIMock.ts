import pretty from "json-pretty";
import { generateMocks } from "./generateMocks";

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
  request,
  returnValue: string
) {
  commonSnapshotState = this.snapshotState;

  let url;
  let method;
  let mock;

  if (request.config && request.config.method && request.config.url && request.status && request.data) {
    //request is done with axios library (https://www.npmjs.com/package/axios)
    method = request.config.method.toUpperCase();
    url = request.url;
    mock = { status: request.status, body: request.data }
  } else if (request.response && request.opts && request.opts.method) {
    //request is done with r2 library (https://github.com/mikeal/r2)
    const res = request.response;
    method = request.opts.method.toUpperCase();
    url = res.url;
    mock = { status: res.status, body: res.body }
  } else if (request.url && request.status) {
    //request is done with fetch library (https://www.npmjs.com/package/node-fetch)
    method = request.method || "GET"; // this doesn't work
    url = request.url;
    mock = { status: request.status, body: await request.text() };
  } else {
    console.error("The response is not supported, we're supporting only the usage of",
      " : axios(https://www.npmjs.com/package/axios), r2(https://github.com/mikeal/r2) & ",
      "fetch(https://www.npmjs.com/package/node-fetch)",
      "You can submit an issue on https://github.com/Iqoqo/mockshot/issues to add support for another library");
    mock = { status: -1, body: undefined };
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
