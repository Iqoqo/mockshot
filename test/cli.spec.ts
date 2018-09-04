import { cliRun } from "../src/cli";
describe("cli tests", () => {
  it("should run", async () => {
    await cliRun(["./mocks/"]);
  });
});
