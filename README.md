<div align="center">
<img alt="Mockshot" src="./public/img/mockshot.png" width=500/>

### Automatic mocks generation from snapshot tests

[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/Iqoqo/mockshot/blob/master/LICENSE) [![npm version](https://img.shields.io/npm/v/mockshot.svg?style=flat)](https://www.npmjs.com/package/mockshot) [![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier) [![Tested with Jest](https://img.shields.io/badge/tested_with-jest-99424f.svg)](https://github.com/facebook/jest)

</div>

## TL;DR

Imagine you could:

1.  Never manually write a mock again
2.  Have a guarantee that your mocks are always valid

Mockshot give you these superpowers, and more.

## Overview

[Snapshot testing](https://jestjs.io/docs/en/snapshot-testing) may commonly be known for UI testing, but the mechanism itself can be used to test the shape of any object. Mockshot utilizes the artifacts of snapshot tests to generate mocks. The flow can be summarized:

1.  Write a Jest snapshot test for a method.
2.  Use the snapshot's output as blueprints for generating a mock.
3.  Let other methods use that mock in their tests.

In this flow, we test a method against its _own_ mock, then expose this mock to the world. This means we are shifting the responsibility of generating a mock from the _consumer_ to the _source_.

This pattern is called _Test Coupling_ since two isolated unit tests are now coupled together by the same mock. A change in the source's interface will lead to a change in the mock and from there - to all consumer's tests.

Your unit test is now powerful as an integration test. Wow.

# Usage

## install

> Mockshot requires the jest testing framework. Installation of Jest is not covered in this document.

After setting up Jest, simply yarn or npm Mockshot

```
$ yarn install mockshot
```

## Quickstart

### 1. Write a test:

```ts
import "mockshot";
import { SomeClass } from "./SomeClass";

describe("SomeClass", () => {
  it("getSomeData should return the correct shape", () => {
    // Arrange
    const instance = new SomeClass();

    // Act
    const result = instance.getSomeData();
    // result === { foo: "bar" }

    // Assert with Mockshot
    expect(result).toMatchMock(SomeClass, "getSomeData", "success");
  });
});
```

### 2. Run the test to generate a snapshot:

```
$ jest './SomeClass.spec.ts'
 PASS  examples/simple/SomeClass.spec.ts
  SomeClass
    ✓ getSomeData should return the correct shape (5ms)

 › 1 snapshot written.
Snapshot Summary
 › 1 snapshot written from 1 test suite.

Test Suites: 1 passed, 1 total
Tests:       1 passed, 1 total
Snapshots:   1 written, 1 total
Time:        5.213s
Ran all test suites matching /.\/SomeClass.spec*/i.
✨  Done in 6.80s.
```

### 3. Run mockshot to generate a mock:

```
$ yarn run mockshot
```

The generated mock is now ready for use in `./mocks/SomeClassMocks.ts`:

```ts
export class SomeClassMocks {
  static getSomeData(mock: "success"): any {
    switch (mock) {
      case "success":
        return {
          foo: "bar"
        };
      default:
        throw Error("Unknown mock: " + mock);
    }
  }
}
```

### 4. Consume the mock

```ts
import { UsingSomeClass } from "./UsingSomeClass";
import { SomeClassMocks } from "./mocks/SomeClass";

describe("UsingSomeClass", () => {
  it("Should parse getSomeData", () => {
    // Prepare the stub with our mock data
    const someClassMock = {
      getSomeData: () => SomeClassMocks.getSomeData("success")
    };
    const instance = new UsingSomeClass(someClassMock);

    // Now when UsingSomeClass will call getSomeData it will get { foo: "bar" }
  });
});
```

## Key Features

1.  Mock any Javascript object using custom matchers.
2.  Special matchers for API responses for generating server mocks.
3.  Mocks are using Typescript for enhanced auto-complete.
4.  Special generators for class mocks, API server mocks and more.

# Mockshot, In Depth

## Introduction

Mockshot is an extension over Jest's snapshot mechanism. It uses `toMatchSnapshot` under the hood to create special annotated snapshots that can later be used buy a generator to construct JS or TS objects using AST.

## Matchers

Matchers are the assert methods used during the test to generate the mock blueprints. They serialize the object and prepare its shape. We currently have 2 matchers:

### toMatchMock - for mocking class method

`toMatchMock(className: string, methodName: string, mockName: string, ignorePath: any[])`

#### className: string | Object

The name of the class to mock. You can supply a string but it is better to provide the actual class. Mockshot will detect the class's name by looking at `cls.constructor.name`.

#### methodName: string

The name of the method response to mock. Unfortunately we can't auto detect the name of the method just by looking at its reference, so make sure this string is correct.

#### mockName

The name of the mock. Since each method can have multiple responses, we provide a name for each mock, ie - `success` or `empty-list` or `error` are some examples.

### ignorePath

An array of paths to ignore. Since snapshot matches the objects, a non constant values like `id` or `timestamp` will change from test to test. You can provide an ignore path to ignore the content of this values. In that case, Mockshot will only check the _existence_ of the keys and the _type_ of the value, without looking at the content (ie, it will verify there is a key named `id` with value type `string`).

```ts
const value = SomeClass.getSomething();
expect(value).toMatchMock(SomeClass, "getSomething", "success", ["id"]);
```

### toMatchApiMock - for mocking HTTP response

Same as previous matcher, but designed especially to serialize an HTTP response. In that case you don't need to supply a class or method name, since all required data as path, status and methods is infered from the object.

```ts
const value = await axios.get("http://somewhere.com/user");
expect(value).toMatchMock(value);
```

This will generate the following mock:

```ts
export class API {

    static get<T extends keyof getResponses>(url: T): getResponses[T] {
        switch (url) {
            case "/user":
                return { success:
                   { body:
                      { data: /* Response serialized here */ }
                    status: 'OK' },
                    statusCode: 200 } }
}
```

You can then use the mock: 

```ts
import { API } from "./mocks";

const response = API.get("/user", success);
/**
 * response is now the same HTTP Response object as we had before
 * */
axios.get.mockImplementation(()=>response)
```
## Generator

After you've created the snapshots you will run the generator. It will traverse the codebase, looking for snapshots created by Mockshot and generate and actual Typescript and Javascript files with your mocks, depending on their type (methods or api).

TBA
