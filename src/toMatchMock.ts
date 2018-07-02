import { cloneDeep, get, set } from 'lodash';
import pretty from 'json-pretty'

expect.addSnapshotSerializer({
  test: val => val.mock,
  print: val => pretty(val)
});

function getSnapshotName(testName) {
  return `${testName}: [mockshot] 1`;
}
function toMatchMock(received, className: string, methodName: string, mockName: string, ignoredKeyPaths?: string[]) {
  const snapshotName = getSnapshotName(this.currentTestName);
  const currentSnapshot = this.snapshotState._snapshotData[snapshotName];
  
  if (ignoredKeyPaths && currentSnapshot) {
    const parsedSnapshot = JSON.parse(currentSnapshot);
    received = cloneDeep(received);

    ignoredKeyPaths.forEach(keyPath => {
      const val = get(parsedSnapshot.mock, keyPath);
      const target = get(received, keyPath);
      if(val && target && typeof(val) === typeof(target)){
        set(received, keyPath, val);
      }
    })

  }
  const snapshot = { className, methodName, mockName,  mock: received}
  const snapshotName = `[${className} ${methodName} ${mockName}]`;
  const result = expect(snapshot).toMatchSnapshot(`[mockshot] [${snapshotName}]`);
  const pass = result===undefined;
  return { pass };
}

expect.extend({ toMatchMock });

export { toMatchMock };