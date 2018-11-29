import { IApiSnapData, IApiSnapDataBase } from "../contracts";

export const ApiSnapshotTag = "[APISnap]";

async function parse(response): Promise<IApiSnapDataBase> {
  if (
    response.config &&
    response.config.method &&
    response.config.url &&
    response.status &&
    response.data
  ) {
    // response is done with axios library (https://www.npmjs.com/package/axios)
    return {
      httpMethod: response.config.method.toLowerCase(),
      url: response.config.url,
      mock: { statusCode: response.status, body: response.data }
    };
  } else if (response.response && response.opts && response.opts.method) {
    // response is done with r2 library (https://github.com/mikeal/r2)
    const res = await response.response;
    return {
      httpMethod: response.opts.method.toLowerCase(),
      url: res.url,
      mock: { statusCode: res.status, body: await response.text }
    };
  } else if (response.url && response.status) {
    // response is done with fetch library (https://www.npmjs.com/package/node-fetch)
    return {
      httpMethod: response.method || "get", // this doesn't work
      url: response.url,
      mock: { statusCode: response.status, body: await response.text() }
    };
  } else if (response.status && response.req && response.req.method) {
    // response is done with chai library (https://www.google.it.on.your/own)
    return {
      httpMethod: response.req.method.toLowerCase(),
      url: response.req.path,
      mock: { statusCode: response.status, body: response.body }
    };
  } else {
    throw Error(
      `The response is not supported, we're supporting only the usage of:
            axios(https://www.npmjs.com/package/axios), r2(https://github.com/mikeal/r2) &
            fetch(https://www.npmjs.com/package/node-fetch)
            You can submit an issue on https://github.com/Iqoqo/mockshot/issues to add support for another library`
    );
  }
}

export async function toMatchApiMock(response, mockName: string) {
  let parsedResponse: IApiSnapDataBase;
  try {
    parsedResponse = await parse(response);
  } catch (err) {
    return { pass: false, message: () => err.message };
  }

  const snapshot: IApiSnapData = { mockName, ...parsedResponse };
  const snapshotTag = `[mockshot] ${ApiSnapshotTag} [${
    parsedResponse.httpMethod
  } ${parsedResponse.url} ${mockName}]`;

  return {
    pass: undefined === expect(snapshot).toMatchSnapshot(snapshotTag),
    message: () => `expected ${snapshot} to match tag ${snapshotTag}`
  };
}
