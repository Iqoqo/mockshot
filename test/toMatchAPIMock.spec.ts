import "../src/toMatchApiMock";
import axios from "axios";
import { request } from "https";
import { RequestModules } from "../src/toMatchApiMock";
const adapter = require("axios/lib/adapters/http");
import fetch from "node-fetch"
//const fetch = require("node-fetch");

describe("toMatchApiMock()", () => {
  it("Should work with axios module", async () => {
    const res = await axios.get("https://www.example.com", { adapter });
    expect(res).toMatchApiMock(RequestModules.axios, "success");
  });

  it("Should fail", async () => {
<<<<<<< HEAD
    const res = await axios.get("https://www.example.com", { adapter });
    expect(res).toMatchApiMock(RequestModules.axios, "failure");
=======
    const res = await axios.get("https://www.google.com", { adapter });
    expect(res).toMatchAPIMock("failure");
>>>>>>> f3fe8f30253519461bf362c0b17a874272882a52
  });

  it("Should work with reuqest module", async () => {
    const res = await request("https://www.example.com");
    console.log(res);
    expect(res).toMatchApiMock(RequestModules.request, "success");
  });

  it.only("Should work with fetch module", async () => {
    const res = await fetch("https://www.example.com");
    console.log(res);
    expect(res).toMatchApiMock("success");
  });

});
