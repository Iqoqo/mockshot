import { run } from "../src/cli";
describe("cli tests", () => {
  it("should run", async () => {
    await run(["./dist/"]);
  });
});
