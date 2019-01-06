/**
 * Copyright (c) Samsung, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import { SourceFile } from "ts-simple-ast";
import { ISnapshot } from "../contracts";

export abstract class MockGenerator {
  abstract generate(
    getFile: (fileName: string) => SourceFile,
    snapshots: ISnapshot[]
  ): void;
}
