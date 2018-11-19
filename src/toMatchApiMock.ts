import pretty from "json-pretty";

expect.addSnapshotSerializer({
  test: val => val.mock,
  print: val => pretty(val)
});

async function parse(response) {
  if (
    response.config &&
    response.config.method &&
    response.config.url &&
    response.status &&
    response.data
  ) {
    //response is done with axios library (https://www.npmjs.com/package/axios)
    return {
      method: response.config.method.toUpperCase(),
      url: response.config.url,
      mock: { status: response.status, body: response.data }
    };
  } else if (response.response && response.opts && response.opts.method) {
    //response is done with r2 library (https://github.com/mikeal/r2)
    const res = await response.response;
    return {
      method: response.opts.method.toUpperCase(),
      url: res.url,
      mock: { status: res.status, body: await response.text }
    };
  } else if (response.url && response.status) {
    //response is done with fetch library (https://www.npmjs.com/package/node-fetch)
    return {
      method: response.method || "GET", // this doesn't work
      url: response.url,
      mock: { status: response.status, body: await response.text() }
    };
  } else {
    console.error(
      "The response is not supported, we're supporting only the usage of",
      " : axios(https://www.npmjs.com/package/axios), r2(https://github.com/mikeal/r2) & ",
      "fetch(https://www.npmjs.com/package/node-fetch)",
      "You can submit an issue on https://github.com/Iqoqo/mockshot/issues to add support for another library"
    );
    return {
      method: "unknown Method",
      url: "unknown URL",
      mock: { status: -1, body: undefined }
    };
  }
}

async function toMatchApiMock(response, mockName: string) {
  const parsedResponse = await parse(response);

  const snapshot = { mockName, ...parsedResponse };
  const snapshotNameTag = `${parsedResponse.method} ${
    parsedResponse.url
  } ${mockName}`;

  const result = expect(snapshot).toMatchSnapshot(
    `[mockshot] [API] [${snapshotNameTag}]`
  );

  return { pass: result === undefined };
}

expect.extend({ toMatchApiMock });

export { toMatchApiMock };
