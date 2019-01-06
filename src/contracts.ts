/**
 * Copyright (c) Samsung, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
export interface ISnapshot {
  key: string;
  packageName?: string;
  filePath: string;
  data: any;
}

export interface IApiSnapshot extends ISnapshot {
  data: IApiSnapData;
}

export interface IClassSnapshot extends ISnapshot {
  data: IClassSnapData;
}

export interface IApiSnapData extends IApiSnapDataBase {
  mockName: string;
}

export interface IClassSnapData {
  className: string;
  methodName: string;
  mockName: string;
  mock: any;
}

export interface IApiSnapDataBase {
  url: string;
  httpMethod: "post" | "get" | "put" | "delete" | "patch";
  mock: {
    statusCode: number;
    body: any;
    error?: string;
  };
}

export type MatcherReturn = {
  pass: boolean;
  message(): string | (() => string);
};

export type ClassMockTree = {
  [mockPath: string]: {
    className: string;
    classContent: SingleClassMockTree;
  };
};

export type SingleClassMockTree = {
  [methodName: string]: {
    [mockName: string]: {
      mock: any;
      meta: { key: string; originFile: string };
    };
  };
};
