import { ApiGenerator } from "../generators/ApiGenerator";
import { SnapshotFetcher } from "./util";

export function run(args: string[]) {
  const outputDir = args[0];

  const snapshots = SnapshotFetcher.getSnapshots();

  const apiGenerator = new ApiGenerator(outputDir);
  apiGenerator.generate(snapshots);
}
