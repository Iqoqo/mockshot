#!/usr/bin/env node
/**
 * Copyright (c) Samsung, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import { run } from "../run";

export async function cliRun(args: string[]) {
  const outputDir = args[0] || "./@mocks";
  await run(outputDir);
}

cliRun(process.argv.slice(2))
