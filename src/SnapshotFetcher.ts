import path from "path";
import globby from "globby";
import { SnapshotState } from "jest-snapshot";

export class SnapshotFetcher {
  private static readonly patterns = [
    "*/__snapshots__/*.snap",
    "!**/node_modules/**",
    "!./.{git,svn,hg}/**"
  ];

  static getSnapshots(): object {
    const snapFiles = SnapshotFetcher.getFilePaths();
    return SnapshotFetcher.getSnapsFromFiles(snapFiles);
  }

  static getFilePaths(): string[] {
    const fullPatterns = SnapshotFetcher.patterns;
    const filePaths = globby
      .sync(fullPatterns, { dot: true, nodir: true })
      .map(filePath => path.relative(process.cwd(), filePath));

    if (filePaths.length === 0) {
      console.error(
        `No matching files. Patterns tried: ${fullPatterns.join(" ")}`
      );
      process.exitCode = 2;
    }
    return filePaths;
  }

  static getSnapsFromFiles(filePaths: string[]): object {
    return filePaths
      .map(SnapshotFetcher.getSnapsFromFile)
      .reduce((acc, cur) => ({ ...acc, ...cur }), {});
  }

  static getSnapsFromFile(filePath: string): object {
    const absolutePath = path.resolve(filePath);
    const state = new SnapshotState(absolutePath, {
      snapshotPath: absolutePath
    });
    const data = state._snapshotData;
    const keys = Object.keys(data);

    const snaps = keys
      .filter(SnapshotFetcher.isMockshotSnap)
      .reduce((acc, cur) => ({ ...acc, cur: state._snapshotData[cur] }), {});

    return snaps;
  }

  private static isMockshotSnap(key: string): boolean {
    return key.indexOf("[mockshot]") !== -1;
  }
}
