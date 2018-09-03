import Project, { CodeBlockWriter } from "ts-simple-ast";
import fs from "fs";
const util = require('util')

const mockFileName = "API.ts";
const methodParameter = "url";

export class ApiGenerator {
  private project: Project;

  constructor(outDir = "dist/mocks") {
    this.project = new Project({
      compilerOptions: { outDir, declaration: true }
    });
  }

  async generate(snapshot) {
    const parsed = this.parse(snapshot)

    try {
      await fs.unlinkSync(mockFileName);
      console.log("File exists", mockFileName, "removing...");
    } catch (ex) { }

    const fileDeclaration = this.project.createSourceFile(mockFileName)

    fileDeclaration
      .addClass({ name: "API" })
      .setIsExported(true)
      .addMethods(this.getMethodsFrom(parsed))
      .map(methodDeclaration => {
        methodDeclaration.setBodyText(
          this.getSwitchStatement(methodParameter, parsed[methodDeclaration.getName()])
        )
      })

    fileDeclaration.addInterfaces(this.getInterfacesFrom(parsed))

    await this.project.save();
  }

  private getMethodsFrom(parsed) {
    return Object.keys(parsed).map(method => ({
      isStatic: true,
      parameters: [{ name: methodParameter, type: "T" }],
      name: `${method}<T extends keyof ${method}Responses>`,
      returnType: `${method}Responses[T]`
    }))
  }

  private getInterfacesFrom(parsed) {
    return Object.keys(parsed).map(method => ({
      name: `${method}Responses`,
      isExported: true,
      properties: Object.keys(parsed[method])
        .map(url => {
          const types = Object.keys(parsed[method][url])
            .map(type => `${type}: any`).join()
          return { name: `"${url}"`, type: `{${types}}` }
        })
    }))
  }

  private parse(snapshots) {
    const parsed = {}
    snapshots.map(snapshot => {
      this.addToObj(parsed, snapshot.httpMethod, (methodContent) =>
        this.addToObj(methodContent, snapshot.url, (urlContent) =>
          this.addToObj(urlContent, snapshot.mockName, (mockContent) => {
            if (snapshot.body) mockContent["body"] = snapshot.body
            if (snapshot.error) mockContent["error"] = snapshot.error
            if (snapshot.statusCode) mockContent["statusCode"] = snapshot.statusCode
          })
        )
      )
    })
    return parsed
  }

  private addToObj(obj, name, cb) {
    const subObj = obj[name] || {}

    cb(subObj)

    obj[name] = subObj
    return obj
  }

  private getSwitchStatement(methodParameter: string, options: object) {
    return (writer: CodeBlockWriter) =>
      writer
        .write(`switch (${methodParameter})`)
        .block(() =>
          Object.keys(options).map(key =>
            writer
              .write(`case "${key}":`)
              .indentBlock(() => writer.write(`return ${util.inspect(options[key], { depth: null })}`))
          )
        );
  }
}
