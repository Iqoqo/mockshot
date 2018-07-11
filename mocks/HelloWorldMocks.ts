export class HelloWorldMocks {
    static bar;

    static bar(mock: "no-valid-params" | "success"): any {
        switch (mock) {
            case "no-valid-params":
                return {
                  "error": "yes"
                }
            case "success":
                return {
                  "api": {
                    "data": "123"
                  }
                }
            default:
                throw Error("Unknown mock: "+mock);
        }
    }

    static shape;

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

    static foo;

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
