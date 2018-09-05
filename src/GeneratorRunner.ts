import Project from "ts-simple-ast";
import fs from "fs";

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
    const fileName = generator.getFilename();
    const fileDeclaration = this.createSourceFile(fileName);
    generator.doGenerate(fileDeclaration, this.snapshots);
  };

  private createSourceFile = (mockFileName: string) => {
    try {
      fs.unlinkSync(this.outDir + mockFileName);
      console.log("File exists", mockFileName, "removing...");
    } catch (ex) {}
    return this.project.createSourceFile(this.outDir + mockFileName);
  };
}
