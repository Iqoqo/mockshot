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
    expect(res).toMatchApiMock("success");
  });

  it("Should fail", async () => {
    const res = await axios.get("https://www.example.com", { adapter });
    expect(res).toMatchApiMock("failure");
  });

  it.skip("Should work with reuqest module", async () => {
    const res = await request("https://www.example.com");
    await expect(res).toMatchApiMock("success");
  });

  it("Should work with r2 module", async () => {
    const res = await r2.get("https://www.example.com");
    await expect(res).toMatchApiMock("success");
  });

  it("Should work with fetch module", async () => {
    const res = await fetch("https://www.example.com");
    await expect(res).toMatchApiMock("success");
  });

  it("Should not work with unsupported response object (not of type axios, r2, fetch)", async () => {
    const res = {statttus : 200, my_url : "https://www.example.com"}
    await expect(res).toMatchApiMock("failure-unsupported-response");
  });

});
