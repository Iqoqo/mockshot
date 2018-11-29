import { SourceFile } from "ts-simple-ast";
import { ISnapshot } from "../contracts";

export abstract class MockGenerator {
  abstract generate(
    getFile: (fileName: string) => SourceFile,
    snapshots: ISnapshot[]
  ): void;
}
