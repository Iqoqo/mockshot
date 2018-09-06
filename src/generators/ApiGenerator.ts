import { CodeBlockWriter, SourceFile } from "ts-simple-ast";
import util from "util";
import _ from "lodash";

import { MockGenerator } from "./base";
import { ApiSnapshotTag, IApiSnapshot } from "../matchers/contracts";

const methodParameter = "url";

export class ApiGenerator extends MockGenerator {
  getFilename() {
    return "API.ts";
  }

  filterSnapKeys(keys: string[]): string[] {
    return keys.filter(key => _.includes(key, ApiSnapshotTag));
  }

  generate(fileDeclaration: SourceFile, snapshots: object) {
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
          .map(type => `"${type}": any`)
          .join();
        return { name: `"${url}"`, type: `{${types}}` };
      })
    }));
  }

  private parsed = {};

  private validate(snap, key) {
    if (!this.isHttpMethodValid(snap.httpMethod)) {
      throw Error(
        `Invalid http method '${snap.httpMethod}' in snapshot '${key}'`
      );
    }
    if (!snap.url) {
      throw Error(`Missing property url in snapshot '${key}'`);
    }
    if (!snap.mockName) {
      throw Error(`Missing property mockName in snapshot '${key}'`);
    }
    if (!snap.mock) {
      throw Error(`Missing property mock in snapshot '${key}'`);
    }
    if (!snap.mock.statusCode) {
      throw Error(`Missing property statusCode in snapshot '${key}'`);
    }
  }

  private fillMissingPath(snap) {
    if (!_.has(this.parsed, snap.httpMethod)) {
      this.parsed[snap.httpMethod] = {};
    }
    if (!_.has(this.parsed[snap.httpMethod], snap.url)) {
      this.parsed[snap.httpMethod][snap.url] = {};
    }
  }

  private parse(snapshots: object) {
    _.keys(snapshots).forEach(key => {
      const snap: IApiSnapshot = snapshots[key];

      this.validate(snap, key)
      this.fillMissingPath(snap)

      if (_.has(this.parsed[snap.httpMethod][snap.url], snap.mockName)) {
        throw Error(
          `Snapshot duplication: snapshot with the same httpMethod, URL and mockName already exists '${key}'`
        );
      }
      this.parsed[snap.httpMethod][snap.url][snap.mockName] = snap.mock;
    });

    return this.parsed;
  }

  private isHttpMethodValid(method: string): boolean {
    return _.includes(["post", "get", "put", "delete", "patch"], method);
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
