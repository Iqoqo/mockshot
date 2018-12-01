import { GeneratorRunner } from "./GeneratorRunner";
import { ApiGenerator, ClassGenerator, ClassSpyGenerator } from "./generators";
import { SnapshotFetcher } from "./SnapshotFetcher";

export async function run(outputDir: string) {
  const snapshots = SnapshotFetcher.getSnapshots();

  const generators = [
    new ApiGenerator(),
    new ClassGenerator(),
    new ClassSpyGenerator()
  ];

  const generatorRunner = new GeneratorRunner(outputDir, generators, snapshots);
  await generatorRunner.run();
}
