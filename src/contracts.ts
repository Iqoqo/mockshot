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
