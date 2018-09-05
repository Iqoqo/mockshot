import { run } from "../src";
describe("cli tests", () => {
  it("should run", async () => {
    await run("./mocks/");
  });
});
