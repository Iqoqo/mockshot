<div align="center">
<img alt="Mockshot" src="./public/img/mockshot.png" width=500/>

### A mocking framework which generates mocks from your snapshot tests.

[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/Iqoqo/mockshot/blob/master/LICENSE) [![npm version](https://img.shields.io/npm/v/mockshot.svg?style=flat)](https://www.npmjs.com/package/mockshot) [![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier) [![Tested with Jest](https://img.shields.io/badge/tested_with-jest-99424f.svg)](https://github.com/facebook/jest)
</div>

## Contents

* [Introduction](#introduction)
* [Installation](#installation)
* [Setup](#setup)
* [Usage](#usage)
  * [Class mock](#class-mocks)
  * [Endpoints api mock](#endpoint-api-mocks)
* [Restrictions](#restrictions)

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
