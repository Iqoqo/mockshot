/**
 * Copyright (c) Samsung, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
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
    const filePath = path.join(this.outDir, mockFileName);
    if (fs.existsSync(filePath)) {
      console.log("File exists", mockFileName, "removing...");
      fs.unlinkSync(filePath);
    }
    return this.project.createSourceFile(filePath);
  };
}
