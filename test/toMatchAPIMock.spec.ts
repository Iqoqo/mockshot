import "../src/matchers/toMatchApiMock";
import axios from "axios";
import { request } from "https";
const adapter = require("axios/lib/adapters/http");
// import fetch from "node-fetch";

describe("toMatchApiMock()", () => {
  it.only("Should work with axios module", async () => {
    const res = await axios.get("https://www.example.com", { adapter });
    expect(res).toMatchApiMock("success");
  });

  it("Should fail", async () => {
    const res = await axios.get("https://www.google.com", { adapter });
    expect(res).toMatchAPIMock("failure");
  });

  it("Should work with reuqest module", async () => {
    const res = await request("https://www.example.com");
    console.log(res);
    expect(res).toMatchApiMock("success");
  });

  it("Should work with fetch module", async () => {
    const res = await fetch("https://www.example.com");
    console.log(res);
    expect(res).toMatchApiMock("success");
  });
});
