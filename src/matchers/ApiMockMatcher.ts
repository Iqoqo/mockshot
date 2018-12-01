import { MockshotTag, Success } from "../constants";
import url from "url";
import { IApiSnapData, IApiSnapDataBase, MatcherReturn } from "../contracts";

export const ApiSnapshotTag = "[APISnap]";

export async function toMatchApiMock(
  response,
  mockName: string = Success
): Promise<MatcherReturn> {
  let parsedResponse: IApiSnapDataBase;
  try {
    parsedResponse = await parse(response);
  } catch (err) {
    return { pass: false, message: () => err.message };
  }

  const snapshot: IApiSnapData = { mockName, ...parsedResponse };
  const snapshotTag = `${MockshotTag} ${ApiSnapshotTag} [${
    parsedResponse.httpMethod
  } ${parsedResponse.url} ${mockName}]`;

  return {
    pass: undefined === expect(snapshot).toMatchSnapshot(snapshotTag),
    message: () => `expected ${snapshot} to match tag ${snapshotTag}`
  };
}

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
      url: getPathname(response.config.url),
      mock: { statusCode: response.status, body: response.data }
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
      url: getPathname(response.request.url),
      mock: { statusCode: response.status, body: response.body }
    };
  } else {
    throw Error(
      `The response is not supported.
       we're supporting only the usage of: chai & axios
       You can submit an issue on https://github.com/Iqoqo/mockshot/issues to add support for another library`
    );
  }
}

function getPathname(responseUrl: string): string {
  const pathname = url.parse(responseUrl).pathname;
  if (pathname === undefined) {
    throw new Error(`could not parse path name for url ${responseUrl}`);
  }
  return pathname;
}
