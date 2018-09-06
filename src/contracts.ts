export interface ISnapshot {
  key: string;
  packageName?: string;
  filePath: string;
  data: IClassSnapshot | IApiSnapshot;
}
export interface IApiSnapshot extends IApiSnapBase {
  mockName: string;
}

export interface IClassSnapshot {
  className: string;
  methodName: string;
  mockName: string;
  mock: any;
}

export interface IApiSnapBase {
  url: string;
  httpMethod: "post" | "get" | "put" | "delete" | "patch";
  mock: {
    statusCode: number;
    body: any;
    error?: string;
  };
}
