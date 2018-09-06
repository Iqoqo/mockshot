import Project from "ts-simple-ast";
import fs from "fs";
import path from "path";

import { MockGenerator } from "./generators/base";

export class GeneratorRunner {
  private project: Project;

  constructor(
    private outDir: string,
    private generators: MockGenerator[],
    private snapshots: object
  ) {
    this.project = new Project();
  }

  async run() {
    this.generators.forEach(this.runGenerator);
    await this.project.save();
    await this.project.emit();
  }

  private runGenerator = (generator: MockGenerator) => {
    generator.doGenerate(this.createSourceFile, this.snapshots);
  };

  private createSourceFile = (mockFileName: string) => {
    try {
      fs.unlinkSync(path.join(this.outDir, mockFileName));
      console.log("File exists", mockFileName, "removing...");
    } catch (ex) {}
    return this.project.createSourceFile(path.join(this.outDir, mockFileName));
  };
}
