import path from "path";
import { SnapshotFetcher } from "../../src/SnapshotFetcher";

export const getOwnSnapshots = ownFilePath =>
  SnapshotFetcher.getSnapsFromFile(getSnapFilePath(ownFilePath));

const getSnapFilePath = testFilePath =>
  path.join(
    path.dirname(testFilePath),
    "__snapshots__",
    getSnapFileName(testFilePath)
  );

const getSnapFileName = testFilePath => `${path.basename(testFilePath)}.snap`;
