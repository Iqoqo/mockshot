"use strict";
exports.__esModule = true;
var HelloWorldMocks = /** @class */ (function () {
    function HelloWorldMocks() {
    }
    HelloWorldMocks.foo = function (mock) {
        switch (mock) {
            case "default-param":
                return "unknown";
            case "success":
                return {
                    "foo": "barr"
                };
            default:
                throw Error("Unknown mock: " + mock);
        }
    };
    HelloWorldMocks.bar = function (mock) {
        switch (mock) {
            case "success":
                return {
                    "data": {
                        "_id": "12342423432"
                    },
                    "id": "123456758",
                    "some": "value"
                };
            default:
                throw Error("Unknown mock: " + mock);
        }
    };
    return HelloWorldMocks;
}());
exports.HelloWorldMocks = HelloWorldMocks;
