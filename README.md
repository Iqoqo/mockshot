<div align="center">
<img alt="Mockshot" src="./public/img/mockshot.png" width=500/>

### Automatic mocks generation from snapshot tests

[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/Iqoqo/mockshot/blob/master/LICENSE) [![npm version](https://img.shields.io/npm/v/mockshot.svg?style=flat)](https://www.npmjs.com/package/mockshot) [![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier) [![Tested with Jest](https://img.shields.io/badge/tested_with-jest-99424f.svg)](https://github.com/facebook/jest)
</div>

## TL;DR

Imagine you could: 

1. Never manually write a mock again
2. Have a guarantee that your mocks are always valid

Mockshot give you these superpowers, and more. 

## Overview

[Snapshot testing](https://jestjs.io/docs/en/snapshot-testing) may commonly be known for UI testing, but the mechanism itself can be used to test the shape of any object. Mockshot utilizes the artifacts of snapshot tests to generate mocks. The flow can be summarized:

1. Write a Jest snapshot test for a method. 
2. Use the snapshot's output as blueprints for generating a mock.
3. Let other methods use that mock in their tests. 

In this flow, we test a method against its *own* mock, then expose this mock to the world. This means we are shifting the responsibility of generating a mock from the *consumer* to the *source*.  

This pattern is called *Test Coupling* since two isolated unit tests are now coupled together by the same mock. A change in the source's interface will lead to a change in the mock and from there - to all consumer's tests.

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
    })
})
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
                  "foo": "bar"
                }
            default:
                throw Error("Unknown mock: "+mock);
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
            getSomeData: ()=>SomeClassMocks.getSomeData("success")
        }
        const instance = new UsingSomeClass(someClassMock);

        // Now when UsingSomeClass will call getSomeData it will get { foo: "bar" }
    })
})

```
## Key Features

1. Mock any Javascript object using custom matchers.
2. Special matchers for API responses for generating server mocks. 
3. Mocks are using Typescript for enhanced auto-complete. 
4. Special generators for class mocks, API server mocks and more.

# Mockshot, In Depth

## Introduction

## Matchers

Matchers are the assert methods used during the test to generate the mock blueprints. They serialize the object and prepare its shape. 


## Contents

* [Introduction](#introduction)
* [Installation](#installation)
* [Setup](#setup)
* [Usage](#usage)
  * [Class mock](#class-mocks)
  * [Endpoints api mock](#endpoint-api-mocks)
* [Restrictions](#restrictions)

# How does it work


## <a name=introduction>Introduction

Mockshot is a framework that generates mocks from all the snapshot tests of your project.  
Using of this library, you'll be able to test your code by semi-automatically generating mocks of your classes and endpoints, seperating each test from its internal methods in the process (a better practice!).

## Installation

`npm install mockshot`

or, if you're yarning -

`yarn add mockshot`

## Setup

Generate mock file from all the snapshots in your project (TODO missing)

## Usage

Mockshot consists of two extension APIs. These are -

### Class mocks

Generating mocks of an entire class.

```javascript
class ThisClassIsMocked {
  foo() {
    return "this is a method";
  }
}
```

To mock this class, all you need to do is `toMatchMock(...)`, as follows:

```javascript
it("Should mock foo method", () => {
  const mockedClass = new ThisClassIsMocked();
  expect(mockedClass.foo()).toMatchMock(
    ThisClassIsMocked.name,
    "foo",
    "success"
  );
});
```

`toMatchMock` method consists of : class name, method name, and mock name. In this example, class name is `ThisClassIsMocked`, method name is `foo` and the mock name is `success`.

### Endpoint api mocks

MockShot can also generate mocks out of your app's very own (existing) API endpoints.

```javascript
it("Should work with fetch module", async () => {
  const response = await fetch(myTestUrl);

  await expect(response).toMatchApiMock("success");
});
```

`toMatchApiMock` mocks a response received from [fetch](https://www.npmjs.com/package/node-fetch) module, with a 'success' as its mock name.
