import { SourceFile } from "ts-simple-ast";
import _ from "lodash";

export abstract class MockGenerator {
  abstract generate(fileDeclaration: SourceFile, snapshots: object): void;
  abstract getFilename(): string;

  filterSnapKeys(snapKeys: string[]): string[] {
    return snapKeys;
  }

  doGenerate(fileDeclaration: SourceFile, snapshots: object): void {
    const keys = this.filterSnapKeys(_.keys(snapshots));
    const snaps = _.pick(snapshots, keys);
    this.generate(fileDeclaration, snaps);
  }
}
