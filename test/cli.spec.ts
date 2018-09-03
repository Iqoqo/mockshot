import { run } from "../src/cli";
describe("cli tests", () => {
  it("should run", () => {
    run(["./dist/"]);
  });
});
