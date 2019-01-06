/**
 * Copyright (c) Samsung, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
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
