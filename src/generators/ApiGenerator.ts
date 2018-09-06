import { CodeBlockWriter, SourceFile } from "ts-simple-ast";
import util from "util";
import _ from "lodash";

import { MockGenerator } from "./base";
import { ApiSnapshotTag } from "../matchers/contracts";
import { IApiSnapshot, ISnapshot } from "../contracts";

const methodParameter = "url";

export class ApiGenerator extends MockGenerator {
  generate(
    getFile: (fileName: string) => SourceFile,
    allSnapshots: ISnapshot[]
  ) {
    const snapshots = allSnapshots.filter(snap =>
      _.includes(snap.key, ApiSnapshotTag)
    );
    const parsed = this.parse(snapshots);
    const fileDeclaration = getFile("API.ts");

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
    return fileDeclaration;
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

  private validate(snapshot) {
    const { key, data: snap } = snapshot;
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

  private fillMissingPath(snap: IApiSnapshot) {
    if (!_.has(this.parsed, snap.httpMethod)) {
      this.parsed[snap.httpMethod] = {};
    }
    if (!_.has(this.parsed[snap.httpMethod], snap.url)) {
      this.parsed[snap.httpMethod][snap.url] = {};
    }
  }

  private parse(snapshots: ISnapshot[]) {
    snapshots.forEach(snapshot => {
      const snap = snapshot.data as IApiSnapshot;

      this.validate(snapshot);
      this.fillMissingPath(snap);

      if (_.has(this.parsed[snap.httpMethod][snap.url], snap.mockName)) {
        throw Error(
          `Snapshot duplication: snapshot with the same httpMethod, URL and mockName already exists '${
            snapshot.key
          }'`
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
