# mockshot
Mockshot is a mocking framework which generates mocks from your snapshot tests.

## Contents
- [Introduction](#introduction)
- [Installation](#installation)
- [Setup](#setup)
- [Usage](#usage)
  - [Class mock](#class-mocks)
  - [Endpoints api mock](#endpoint-api-mocks)
- [Restrictions](#restrictions)

## <a name=introduction>Introduction
Mockshot is a framework that generates mocks from all the snapshot tests of your project.

With the usage of this library, you'll be able to test your code by generating mocks of classes and endpoints, thus making each test seperated from its internal methods.


## Installation
`npm install mockshot` (TODO missing)


## Setup
Generate mock file from all the snapshots in your project (TODO missing)


## Usage
mockshot consists of two extension API's : 
 
 ### Class mocks
   Generating mocks of an entire class. 
   ```javascript
   class ThisClassIsMocked {
      foo() {
         return "this is a method";
      }
   }
   ```
   If you want to mock this class, all we need to do is use `toMatchMock(...)` method : 
   ```javascript
   it("Should mock foo method", () => {
      const mockedClass = new ThisClassIsMocked();
      expect(mockedClass.foo()).toMatchMock(ThisClassIsMocked.name, "foo", "success");
   });
   ```
   `toMatchMock` method consists of : class name, method name, and mock name. In this example, class name is `ThisClassIsMocked`, method name is `foo` and the mock name is `success`.

  ### Endpoint api mocks
   Generating mocks of endpoints apis.
   If you want to mock endpoint api, use : 
   ```javascript
   it("Should work with fetch module", async () => {
     const res = await fetch(testUrl);
     await expect(res).toMatchApiMock("success");
   });   
   ```
   `toMatchApiMock` mocks a response received from [fetch](https://www.npmjs.com/package/node-fetch) module with a success mock name.
   
   
## Restrictions   
In endpoints api mocks, we're supporting 3 libraries : 
- [fetch](https://www.npmjs.com/package/node-fetch)
- [axios](https://www.npmjs.com/package/axios)
- [r2](https://github.com/mikeal/r2)

Please [add an issue](https://github.com/Iqoqo/mockshot/issues/new) if you wish to use a different module which is not listed above.
