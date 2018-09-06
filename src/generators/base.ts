import { SourceFile } from "ts-simple-ast";
import _ from "lodash";

export abstract class MockGenerator {
  abstract generate(
    getFile: (fileName: string) => SourceFile,
    snapshots: object
  ): void;

  filterSnapKeys(snapKeys: string[]): string[] {
    return snapKeys;
  }

  doGenerate(
    getFile: (fileName: string) => SourceFile,
    snapshots: object
  ): void {
    const keys = this.filterSnapKeys(_.keys(snapshots));
    const snaps = _.pick(snapshots, keys);
    this.generate(getFile, snaps);
  }
}
