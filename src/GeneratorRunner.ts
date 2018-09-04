import Project, { CodeBlockWriter, SourceFile } from "ts-simple-ast";
import fs from "fs";

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
  }

  private runGenerator = (generator: MockGenerator) => {
    const fileName = generator.getFilename();
    const fileDeclaration = this.createSourceFile(fileName);
    generator.generate(fileDeclaration, this.snapshots);
  }

  private createSourceFile = (mockFileName: string) => {
    try {
      fs.unlinkSync(this.outDir + mockFileName);
      console.log("File exists", mockFileName, "removing...");
    } catch (ex) {}
    return this.project.createSourceFile(this.outDir + mockFileName);
  }
}

export interface MockGenerator {
  generate: (fileDeclaration: SourceFile, snapshots: object) => void;
  getFilename: () => string;
}
