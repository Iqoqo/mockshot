import { SourceFile } from "ts-simple-ast";

export abstract class MockGenerator {
  abstract generate(fileDeclaration: SourceFile, snapshots: object): void;
  abstract getFilename(): string;
}
