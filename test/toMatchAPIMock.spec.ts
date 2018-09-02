import "../src/toMatchAPIMock";
import axios from "axios";
const adapter = require("axios/lib/adapters/http");

describe("toMatchApiMock()", () => {
  it.only("Should work", async () => {
    const res = await axios.get("https://www.google.com", { adapter });
    expect(res).toMatchAPIMock("success");
  });
});
