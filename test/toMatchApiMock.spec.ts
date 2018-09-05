import "../src/matchers";
import axios from "axios";
import r2 from "r2";
const adapter = require("axios/lib/adapters/http");

const testUrl = "http://www.example.com";

describe("toMatchApiMock()", () => {
  it("Should work with axios module", async () => {
    const res = await axios.get(testUrl, { adapter });
    expect(res).toMatchApiMock("axios-success");
  });

  it("Should be rewritten (the test)", async () => {
    const res = await axios.get(testUrl, { adapter });
    expect(res).toMatchApiMock("axios-failure");
  });

  it("Should work with r2 module", async () => {
    const res = await r2.get(testUrl);
    await expect(res).toMatchApiMock("r2-success");
  });

  it("Should work with fetch module", async () => {
    const res = await fetch(testUrl);
    await expect(res).toMatchApiMock("fetch-success");
  });

  it("Should not work with unsupported response object (not of type axios, r2, fetch)", async () => {
    const res = {
      statttus: 200,
      my_url: testUrl
    };
    await expect(res).not.toMatchApiMock("failure-unsupported-response");
  });
});
