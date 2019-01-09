/**
 * Copyright (c) Samsung, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import { ServerResponse } from "http";
import stringify from "json-stable-stringify";
import { toMatchApiMock } from "./ApiMockMatcher";
import { ClassMatcher, toMatchClassMock } from "./ClassMockMatcher";

declare global {
  namespace jest {
    interface Matchers<R> extends ClassMatcher<R> {
      toMatchApiMock(response: ServerResponse, mockName?: string): R;
      toMatchMock(
        mock: any,
        mockedClassOrClassName: object | string,
        methodName: string,
        mockNameOrIgnoreFields?: string | string[],
        maybeIgnoreFields?: string[]
      ): R;
    }
  }
}

expect.addSnapshotSerializer({
  test: val => val.mock,
  print: val => stringify(val, { space: "  " })
});

const toMatchMock = toMatchClassMock;

expect.extend({ toMatchMock, toMatchClassMock, toMatchApiMock });

export { toMatchMock, toMatchClassMock, toMatchApiMock };
