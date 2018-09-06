export class HelloWorldMocks {
    static foo;

    static foo(mock: "default-param" | "success"): any {
        switch (mock) {
            case "default-param":
                return "unknown"
            case "success":
                return {
                  "foo": "barr"
                }
            default:
                throw Error("Unknown mock: "+mock);
        }
    }

    static bar;

    static bar(mock: "success"): any {
        switch (mock) {
            case "success":
                return {
                  "data": {
                    "_id": "12342423432"
                  },
                  "id": "123456758",
                  "some": "value"
                }
            default:
                throw Error("Unknown mock: "+mock);
        }
    }
}
