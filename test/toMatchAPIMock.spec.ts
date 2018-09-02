import "../src/toMatchAPIMock";
import fetch from "fetch";

describe("toMatchAPIMock()", () => {
  it("Should work", () => {
    const getResult = async () => {
      const res = await fetch("https://www.google.com");
      let b = await res.json();
      console.log(3242312);
      console.log(b);
      return b;
      done();
    };

    // console.log(getResult);
    expect(getResult).toMatchAPIMock("success");
  });
});
