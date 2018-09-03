import { ApiGenerator } from "../generators/ApiGenerator";
import { GeneratorRunner } from "../GeneratorRunner";
import { SnapshotFetcher } from "./util";

export function run(args: string[]) {
  const outputDir = args[0];

  const snapshots = SnapshotFetcher.getSnapshots();

  const generators = [new ApiGenerator()];

  const generatorRunner = new GeneratorRunner(outputDir, generators, snapshots);
  generatorRunner.run();
}
