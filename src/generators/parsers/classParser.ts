import { has, set } from "lodash";
import { ClassMockTree, IClassSnapshot } from "../../contracts";

export const noPackageName = Symbol("noPackageName");

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
  const packageName = snap.packageName || noPackageName;
  const mockPath = [packageName, className, methodName, mockName];
  const meta = { key: snap.key, originFile: snap.filePath };

  if (has(classTree, mockPath)) {
    throw Error(
      `Duplicate mock name on class: ${snap.data.className} for method ${
        snap.data.methodName
      }: ${snap.data.mockName}`
    );
  }
  set(classTree, mockPath, { mock, meta });
}
