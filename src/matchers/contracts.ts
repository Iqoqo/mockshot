export interface IApiSnapBase {
    url: string;
    httpMethod: "post" | "get" | "put" | "delete" | "patch";
    mock: {
        statusCode: number;
        body: any;
        error?: string;
    };
}
export interface IApiSnapshot extends IApiSnapBase {
    mockName: string;
}

export const ApiSnapshotTag = "[APISnap]";
