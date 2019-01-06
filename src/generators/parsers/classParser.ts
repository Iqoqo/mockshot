/**
 * Copyright (c) Samsung, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import { has, set } from "lodash";
import path from "path";
import { ClassMockTree, IClassSnapshot } from "../../contracts";

export function parseClassSnapshots(
  snapshots: IClassSnapshot[]
): ClassMockTree {
  const classTree = {};
  snapshots.forEach(snap => addSingleSnapshot(snap, classTree));
  return classTree;
}

function addSingleSnapshot(
  snap: IClassSnapshot,
  classTree: ClassMockTree
): void {
  const { className, methodName, mockName, mock } = snap.data;
  const mockFilePath = getFilePath(snap);

  const mockPath = [mockFilePath, "classContent", methodName, mockName];
  const meta = { key: snap.key, originFile: snap.filePath };

  if (has(classTree, mockPath)) {
    throw Error(
      `Duplicate mock name on class: ${snap.data.className} for method ${
        snap.data.methodName
      }: ${snap.data.mockName}`
    );
  }
  set(classTree, mockPath, { mock, meta });
  classTree[mockFilePath].className = className;
}

function getFilePath(snap: IClassSnapshot): string {
  const packageName = snap.packageName || "";
  return path.join(packageName, snap.data.className) + ".ts";
}
