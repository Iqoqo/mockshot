import "../src/toMatchApiMock";
import axios from "axios";
import { request } from "https";
import { RequestModules } from "../src/toMatchApiMock";
import r2 from "r2";
const adapter = require("axios/lib/adapters/http");

describe("toMatchApiMock()", () => {
  it("Should work with axios module", async () => {
    const res = await axios.get("https://www.example.com", { adapter });
    expect(res).toMatchApiMock(RequestModules.axios, "success");
  });

  it("Should fail", async () => {
    const res = await axios.get("https://www.example.com", { adapter });
    expect(res).toMatchApiMock(RequestModules.axios, "failure");
  });

  it("Should work with reuqest module", async () => {
    const res = await request("https://www.example.com");
    console.log(res);
    expect(res).toMatchApiMock(RequestModules.request, "success");
  });

  it.only("Should work with r2 module", async () => {
    const res = await r2.get("https://www.example.com");
    expect(res).toMatchApiMock(RequestModules.r2, "success");
  });

});
