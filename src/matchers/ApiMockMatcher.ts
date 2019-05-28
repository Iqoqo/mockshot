/**
 * Copyright (c) Samsung, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import { ServerResponse } from "http";
import url from "url";
import { MockshotTag, Success } from "../constants";
import { IApiSnapData, IApiSnapDataBase, MatcherReturn } from "../contracts";

import { cloneDeep, intersection, set } from "lodash";

export const ApiSnapshotTag = "[APISnap]";

export function toMatchApiMock(
  response: ServerResponse,
  mockName: string = Success,
  ignore?: string[]
): MatcherReturn {
  let parsedResponse: IApiSnapDataBase;
  try {
    parsedResponse = parse(response);
  } catch (err) {
    return { pass: false, message: () => err.message };
  }

  let snapshot: IApiSnapData = { mockName, ...parsedResponse };
  const snapshotTag = `${MockshotTag} ${ApiSnapshotTag} [${
    parsedResponse.httpMethod
    } ${parsedResponse.url} ${mockName}]`;

  if (ignore) {
    snapshot = overrideIgnoredValues(this, snapshotTag, snapshot.mock.body, ignore);
  }

  return {
    pass: undefined === expect(snapshot).toMatchSnapshot(snapshotTag),
    message: () => `expected ${snapshot} to match tag ${snapshotTag}`
  };
}

function overrideIgnoredValues(self, snapshotTag: string, targetTest: {}, ignoreKeys: string[]): any {
  const snapshotName = `${self.currentTestName}: ${snapshotTag} 1`;
  const currentSnapshot = self.snapshotState._snapshotData[snapshotName];
  const parsedSnapshot = JSON.parse(currentSnapshot);
  let cleanSnapshot = Object.keys(parsedSnapshot)
    .filter(key => key === "mock")
    .map(k => parsedSnapshot[k])
    .reduce(v => v);
  cleanSnapshot = Object.keys(cleanSnapshot)
    .filter(key => key === "body")
    .map(k => cleanSnapshot[k])
    .reduce(v => v);

  const mockClone = cloneDeep(targetTest);
  const ignoredKeys = intersection(ignoreKeys, Object.keys(mockClone))
  if (ignoredKeys.length === 0) {
    throw Error("API response did not include ignored key(s): " + ignoreKeys.join(","));
  };
  Object.keys(mockClone).forEach(key => {
    if (ignoreKeys.indexOf(key) > -1) {
      set(mockClone, key, cleanSnapshot[key]);
    }
  });

  parsedSnapshot.mock.body = mockClone;
  return parsedSnapshot;
}

function parse(response): IApiSnapDataBase {
  if (
    response.config &&
    response.config.method &&
    response.config.url &&
    response.status &&
    response.data
  ) {

    // response is produced with axios library (https://github.com/axios/axios)
    return {
      httpMethod: response.config.method.toLowerCase(),
      url: getPathname(response.config.url),
      mock: { statusCode: response.status, body: response.data }
    };
  } else if (response.status && response.req && response.req.method) {
    // response is produced with chai library (https://github.com/chaijs/chai)
    return {
      httpMethod: response.req.method.toLowerCase(),
      url: getPathname(response.request.url),
      mock: { statusCode: response.status, body: response.body }
    };
  } else {
    throw Error(
      `This response type is not supported.
       Only chai (https://github.com/chaijs/chai) and axios (https://github.com/axios/axios) are currently supported.
       Please submit an issue at https://github.com/iqoqo/mockshot/issues`
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
