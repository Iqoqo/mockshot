export class API {
    static post<T extends keyof postResponses>(url: T): postResponses[T] {
        switch (url) {
            case "/hello/world":
                return { success: { body: { foo: { bar: '123' } }, statusCode: 200 },
                  fail: { error: 'not implemented', statusCode: 501 } }
        }
    }

    static get<T extends keyof getResponses>(url: T): getResponses[T] {
        switch (url) {
            case "/bye/world":
                return { success: { body: { foo: { bar: '123' } }, statusCode: 200 } }
            case "/hello/world":
                return { fail: { error: 'not implemented!', statusCode: 501 } }
        }
    }
}

export interface postResponses {
    "/hello/world": {success: any,fail: any};
}

export interface getResponses {
    "/bye/world": {success: any};
    "/hello/world": {fail: any};
}
