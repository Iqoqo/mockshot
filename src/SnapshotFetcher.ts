/**
 * Copyright (c) Samsung, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import fs from "fs";
import globby from "globby";
import { SnapshotState } from "jest-snapshot";
import path from "path";
import { ISnapshot } from "./contracts";

export class SnapshotFetcher {
  private static readonly patterns = [
    "**/__snapshots__/*.snap",
    "!**/node_modules/**",
    "!./.{git,svn,hg}/**"
  ];

  static getSnapshots(): ISnapshot[] {
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

  static getSnapsFromFiles(filePaths: string[]): ISnapshot[] {
    return filePaths
      .map(SnapshotFetcher.getSnapsFromFile)
      .reduce((acc, cur) => [...acc, ...cur], []);
  }

  static getSnapsFromFile(filePath: string): ISnapshot[] {
    const absolutePath = path.resolve(filePath);
    const packageName = SnapshotFetcher.getPackageName(filePath);
    const state = new SnapshotState(absolutePath, {
      snapshotPath: absolutePath
    });
    const data = state._snapshotData;
    const keys = Object.keys(data);

    const snaps = keys.filter(SnapshotFetcher.isMockshotSnap).map(key => ({
      key,
      packageName,
      filePath,
      data: JSON.parse(state._snapshotData[key])
    }));

    return snaps;
  }

  private static getPackageName(snapFilePath: string): string | undefined {
    const packageJsonPath = SnapshotFetcher.findPackageJson(snapFilePath);
    return packageJsonPath
      ? SnapshotFetcher.getPackageNameFromFile(packageJsonPath)
      : undefined;
  }

  private static findPackageJson(snapFilePath: string): string | null {
    let dirName = snapFilePath;
    while (dirName !== ".") {
      dirName = path.dirname(dirName);
      const maybePackageJson = path.join(dirName, "package.json");
      if (fs.existsSync(maybePackageJson)) {
        return maybePackageJson;
      }
    }
    return null;
  }

  private static getPackageNameFromFile(packageJsonPath: string): string {
    const packageJsonContent = fs.readFileSync(packageJsonPath).toString();
    return JSON.parse(packageJsonContent).name;
  }

  private static isMockshotSnap(key: string): boolean {
    return key.indexOf("[mockshot]") !== -1;
  }
}
