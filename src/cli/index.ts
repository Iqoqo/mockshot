import { run } from "../run";

export async function cliRun(args: string[]) {
  const outputDir = args[0];
  await run(outputDir);
}
