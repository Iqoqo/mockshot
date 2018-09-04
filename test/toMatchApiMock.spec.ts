import "../src/toMatchApiMock";
import axios from "axios";
import r2 from "r2";
const adapter = require("axios/lib/adapters/http");

const testUrl = "http://www.example.com"

describe("toMatchApiMock()", () => {
  it("Should work with axios module", async () => {
    const res = await axios.get(testUrl, { adapter });
    expect(res).toMatchApiMock("success");
  });

  it("Should fail", async () => {
    const res = await axios.get(testUrl, { adapter });
    expect(res).toMatchApiMock("failure");
  });

  it("Should work with r2 module", async () => {
    const res = await r2.get(testUrl);
    await expect(res).toMatchApiMock("success");
  });

  it("Should work with fetch module", async () => {
    const res = await fetch(testUrl);
    await expect(res).toMatchApiMock("success");
  });

  it("Should not work with unsupported response object (not of type axios, r2, fetch)", async () => {
    const res = {
      statttus: 200, my_url: testUrl
    }
    await expect(res).toMatchApiMock("failure-unsupported-response");
  });

});
