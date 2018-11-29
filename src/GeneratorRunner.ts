import fs from "fs";
import path from "path";
import Project, { SourceFile } from "ts-simple-ast";
import { ISnapshot } from "./contracts";
import { MockGenerator } from "./generators/base";

export class GeneratorRunner {
  private project: Project;

  constructor(
    private outDir: string,
    private generators: MockGenerator[],
    private snapshots: ISnapshot[]
  ) {
    this.project = new Project();
  }

  async run() {
    this.generators.forEach(this.runGenerator);
    this.project.saveSync();
    await this.project.emit();
  }

  private runGenerator = (generator: MockGenerator) => {
    generator.generate(this.createSourceFile, this.snapshots);
  };

  private createSourceFile = (mockFileName: string): SourceFile => {
    fs.unlinkSync(path.join(this.outDir, mockFileName));
    console.log("File exists", mockFileName, "removing...");
    return this.project.createSourceFile(path.join(this.outDir, mockFileName));
  };
}
