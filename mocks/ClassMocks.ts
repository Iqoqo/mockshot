export class SomeClassMocks {

    static getSomeData(mock: "success"): any {
        switch (mock) {
            case "success":
                return {
                  "foo": "bar"
                }
            default:
                throw Error("Unknown mock: "+mock);
        }
    }
}
