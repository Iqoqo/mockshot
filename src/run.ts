import { GeneratorRunner } from "./GeneratorRunner";
import { ApiGenerator, ClassGenerator } from "./generators";
import { SnapshotFetcher } from "./SnapshotFetcher";

export async function run(outputDir: string) {
  const snapshots = SnapshotFetcher.getSnapshots();

  const generators = [new ApiGenerator(), new ClassGenerator()];

  const generatorRunner = new GeneratorRunner(outputDir, generators, snapshots);
  await generatorRunner.run();
}
