import { cloneDeep, get, set } from "lodash";
import { MockshotTag, Success } from "../constants";
import { IClassSnapData } from "../contracts";

export const ClassSnapshotTag = "[ClassSnap]";

type MatcherReturn = {
  pass: boolean;
  message(): string | (() => string);
};

export interface ClassMatcher<R> {
  toMatchClassMock<T extends object, P extends keyof T>(
    // mock: any,
    mockedClass: T,
    methodName: P,
    mockName?: string,
    ignoreFields?: string[]
  ): R;
  toMatchClassMock<T extends object, P extends keyof T>(
    // mock: any,
    mockedClass: T,
    methodName: P,
    ignoreFields?: string[]
  ): R;
  toMatchClassMock(
    // mock: any,
    className: string,
    methodName: string,
    mockName?: string,
    ignoreFields?: string[]
  ): R;
  toMatchClassMock(
    // mock: any,
    className: string,
    methodName: string,
    ignoreFields?: string[]
  ): R;
}

export function toMatchClassMock(
  mock,
  mockedClassOrClassName,
  methodName,
  mockNameOrIgnoreFields?,
  maybeIgnoreFields?
) {
  const className: string =
    typeof mockedClassOrClassName === "string"
      ? mockedClassOrClassName
      : mockedClassOrClassName.constructor.name;

  let mockName: string = Success;
  let ignoreFields: string[] = [];
  if (typeof mockNameOrIgnoreFields === "string") {
    mockName = mockNameOrIgnoreFields;
  } else if (Array.isArray(mockNameOrIgnoreFields)) {
    ignoreFields = mockNameOrIgnoreFields;
  }
  if (Array.isArray(maybeIgnoreFields)) {
    ignoreFields = maybeIgnoreFields;
  }

  return toMatchClassMockImplementation(
    this,
    mock,
    className,
    methodName,
    mockName,
    ignoreFields
  );
}
function toMatchClassMockImplementation(
  self,
  mock,
  className: string,
  methodName: string,
  mockName: string,
  ignoredKeyPaths?: string[]
): MatcherReturn {
  const snapshotTag = `${MockshotTag} ${ClassSnapshotTag} [[${className} ${methodName} ${mockName}]]`;
  const snapshotName = `${self.currentTestName}: ${snapshotTag} 1`;
  const currentSnapshot = self.snapshotState._snapshotData[snapshotName];
  const mockClone = cloneDeep(mock);

  if (ignoredKeyPaths && currentSnapshot) {
    const parsedSnapshot = JSON.parse(currentSnapshot);

    ignoredKeyPaths.forEach(keyPath => {
      const val = get(parsedSnapshot.mock, keyPath);
      const target = get(mockClone, keyPath);
      if (
        val &&
        target &&
        (typeof val === typeof target || isTimestamp(target))
      ) {
        set(mockClone, keyPath, val);
      }
    });
  }

  const snapshot: IClassSnapData = {
    className,
    methodName,
    mockName,
    mock: mockClone
  };

  return {
    pass: undefined === expect(snapshot).toMatchSnapshot(snapshotTag),
    message: () => `expected ${snapshot} to match tag ${snapshotTag}`
  };
}

const isTimestamp = target => "object" === typeof target && Date.parse(target);
