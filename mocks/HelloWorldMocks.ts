export class HelloWorldMocks {
    static bar(mock: "success" | "no-valid-params"): any {
        switch (mock) {
            case "success":
                return {
                  "api": {
                    "data": "123"
                  }
                }
            case "no-valid-params":
                return {
                  "error": "yes"
                }
            default:
                throw Error("Unknown mock: "+mock);
        }
    }

    static shape(mock: "success"): any {
        switch (mock) {
            case "success":
                return {
                  "data": {
                    "_id": "1234"
                  },
                  "id": "1234sddd56",
                  "some": "value"
                }
            default:
                throw Error("Unknown mock: "+mock);
        }
    }

    static foo(mock: "success"): any {
        switch (mock) {
            case "success":
                return {
                  "foo": "barr"
                }
            default:
                throw Error("Unknown mock: "+mock);
        }
    }
}
