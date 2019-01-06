/**
 * Copyright (c) Samsung, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import url from "url";
import { MockshotTag, Success } from "../constants";
import { IApiSnapData, IApiSnapDataBase, MatcherReturn } from "../contracts";

export const ApiSnapshotTag = "[APISnap]";

export function toMatchApiMock(
  response,
  mockName: string = Success
): MatcherReturn {
  let parsedResponse: IApiSnapDataBase;
  try {
    parsedResponse = parse(response);
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

function parse(response): IApiSnapDataBase {
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
  } else if (response.status && response.req && response.req.method) {
    // response is done with chai library (https://www.google.it.on.your/own)
    return {
      httpMethod: response.req.method.toLowerCase(),
      url: getPathname(response.request.url),
      mock: { statusCode: response.status, body: response.body }
    };
  } else {
    throw Error(
      `The response type is not supported.
       we're supporting only the usage of: chai & axios.
       You can submit an issue on https://github.com/iqoqo/mockshot/issues to add support for another library`
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
