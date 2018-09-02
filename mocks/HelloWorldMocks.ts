export class HelloWorldMocks {
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
