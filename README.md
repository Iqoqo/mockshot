# Mockshot

A mocking framework which generates mocks from your snapshot tests.

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

## Restrictions

MockShot currently supports these three different http libraries -

* [axios](https://www.npmjs.com/package/axios)
* [fetch](https://www.npmjs.com/package/node-fetch)
* [r2](https://github.com/mikeal/r2)

Please [add an issue](https://github.com/Iqoqo/Mockshot/issues/new) in case you'd like to use a different module.
