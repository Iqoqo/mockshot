import "../src/toMatchApiMock";
import axios from "axios";
const adapter = require("axios/lib/adapters/http");

describe("toMatchApiMock()", () => {
  it("Should work", async () => {
    const res = await axios.get("https://www.example.com", { adapter });
    expect(res).toMatchAPIMock("success");
  });

  it("Should fail", async () => {
    const res = await axios.get("https://www.google.com", { adapter });
    expect(res).toMatchAPIMock("failure");
  });
});
