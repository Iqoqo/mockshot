import "../src/toMatchApiMock";
import axios from "axios";
import { request } from "https";
import { RequestModules } from "../src/toMatchApiMock";
import r2 from "r2";
import request from "request";
const adapter = require("axios/lib/adapters/http");
var request = require('request');

describe("toMatchApiMock()", () => {
  it("Should work with axios module", async () => {
    const res = await axios.get("https://www.example.com", { adapter });
    expect(res).toMatchApiMock(RequestModules.axios, "success");
  });

  it("Should fail", async () => {
    const res = await axios.get("https://www.example.com", { adapter });
    expect(res).toMatchApiMock(RequestModules.axios, "failure");
  });

  it.only("Should work with r2 module", async () => {
    const res = await r2("https://www.example.com");
    await expect(res).toMatchApiMock(RequestModules.r2, "success");
  });


});
