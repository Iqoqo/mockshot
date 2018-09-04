import { CodeBlockWriter, SourceFile } from "ts-simple-ast";
import util from "util";

import { MockGenerator } from "./base";
import { ApiSnapshotTag, IApiSnapshot } from "../matchers/toMatchAPIMock";

const methodParameter = "url";

export class ApiGenerator extends MockGenerator {
  getFilename() {
    return "API.ts";
  }

  async generate(fileDeclaration: SourceFile, snapshots: object) {
    const parsed = this.parse(snapshots);

    fileDeclaration
      .addClass({ name: "API" })
      .setIsExported(true)
      .addMethods(this.getMethodsFrom(parsed))
      .map(methodDeclaration => {
        methodDeclaration.setBodyText(
          this.getSwitchStatement(
            methodParameter,
            parsed[methodDeclaration.getName()]
          )
        );
      });

    fileDeclaration.addInterfaces(this.getInterfacesFrom(parsed));
  }

  private getMethodsFrom(parsed) {
    return Object.keys(parsed).map(method => ({
      isStatic: true,
      parameters: [{ name: methodParameter, type: "T" }],
      name: `${method}<T extends keyof ${method}Responses>`,
      returnType: `${method}Responses[T]`
    }));
  }

  private getInterfacesFrom(parsed) {
    return Object.keys(parsed).map(method => ({
      name: `${method}Responses`,
      isExported: true,
      properties: Object.keys(parsed[method]).map(url => {
        const types = Object.keys(parsed[method][url])
          .map(type => `${type}: any`)
          .join();
        return { name: `"${url}"`, type: `{${types}}` };
      })
    }));
  }

  private parse(snapshots: object) {
    const parsed = {};
    this.filterSnapshots(snapshots).map(snapshot => {
      this.addToObj(parsed, snapshot.httpMethod, methodContent =>
        this.addToObj(methodContent, snapshot.url, urlContent =>
          this.addToObj(urlContent, snapshot.mockName, mockContent => {
            const { mock } = snapshot;
            if (mock.body) mockContent["body"] = mock.body;
            if (mock.error) mockContent["error"] = mock.error;
            if (mock.statusCode) mockContent["statusCode"] = mock.statusCode;
          })
        )
      );
    });
    return parsed;
  }

  private filterSnapshots(snapshots: object): IApiSnapshot[] {
    const keys = Object.keys(snapshots);
    return keys.filter(this.isAPISnap).map(key => snapshots[key]);
  }

  private isAPISnap(key: string): boolean {
    return key.indexOf(ApiSnapshotTag) !== -1;
  }

  private addToObj(obj, name, cb) {
    const subObj = obj[name] || {};

    cb(subObj);

    obj[name] = subObj;
    return obj;
  }

  private getSwitchStatement(methodParameter: string, options: object) {
    return (writer: CodeBlockWriter) =>
      writer
        .write(`switch (${methodParameter})`)
        .block(() =>
          Object.keys(options).map(key =>
            writer
              .write(`case "${key}":`)
              .indentBlock(() =>
                writer.write(
                  `return ${util.inspect(options[key], { depth: null })}`
                )
              )
          )
        );
  }
}
