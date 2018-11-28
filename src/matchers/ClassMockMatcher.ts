import { get, set } from "lodash";
import { IClassSnapData } from "../contracts";

export const ClassSnapshotTag = "[ClassSnap]";

export function toMatchClassMock(
  mock: any,
  className: string,
  methodName: string,
  mockName: string,
  ignoreFields: string[]
): { message(): string | (() => string); pass: boolean };
export function toMatchClassMock(
  mock: any,
  className: string,
  methodName: string,
  mockName: string
): { message(): string | (() => string); pass: boolean };
export function toMatchClassMock(
  mock: any,
  className: string,
  methodName: string,
  ignoreFields: string
): { message(): string | (() => string); pass: boolean };
export function toMatchClassMock(
  mock: any,
  className: string,
  methodName: string
): { message(): string | (() => string); pass: boolean };
export function toMatchClassMock<T, P extends keyof T>(
  mock: any,
  mockedClass: { prototype: T },
  methodName: P,
  mockName: string,
  ignoreFields: string[]
): { message(): string | (() => string); pass: boolean };
export function toMatchClassMock<T, P extends keyof T>(
  mock: any,
  mockedClass: { prototype: T },
  methodName: P,
  mockName: string
): { message(): string | (() => string); pass: boolean };
export function toMatchClassMock<T, P extends keyof T>(
  mock: any,
  mockedClass: { prototype: T },
  methodName: P,
  ignoreFields: string[]
): { message(): string | (() => string); pass: boolean };
export function toMatchClassMock<T, P extends keyof T>(
  mock: any,
  mockedClass: { prototype: T },
  methodName: P
): { message(): string | (() => string); pass: boolean };
export function toMatchClassMock(
  mock,
  mockedClassOrClassName,
  methodName,
  mockNameOrIgnoreFields?,
  maybeIgnoreFields?
): { message(): string | (() => string); pass: boolean } {
  const className: string =
    typeof mockedClassOrClassName === "string"
      ? mockedClassOrClassName
      : mockedClassOrClassName.name;

  let mockName: string = "success";
  let ignoreFields: string[] = [];
  if (typeof mockNameOrIgnoreFields === "string") {
    mockName = mockNameOrIgnoreFields;
  } else if (Array.isArray(mockNameOrIgnoreFields)) {
    ignoreFields = mockNameOrIgnoreFields;
  } else if (Array.isArray(maybeIgnoreFields)) {
    ignoreFields = maybeIgnoreFields;
  }

  return toMatchClassMockImplementation(
    mock,
    className,
    methodName,
    mockName,
    ignoreFields
  );
}
function toMatchClassMockImplementation(
  mock,
  className: string,
  methodName: string,
  mockName: string,
  ignoredKeyPaths?: string[]
): { message(): string | (() => string); pass: boolean } {
  const snapshotTag = `[mockshot] ${ClassSnapshotTag} [[${className} ${methodName} ${mockName}]]`;
  const snapshotName = `${this.currentTestName}: ${snapshotTag} 1`;
  const currentSnapshot = this.snapshotState._snapshotData[snapshotName];

  if (ignoredKeyPaths && currentSnapshot) {
    const parsedSnapshot = JSON.parse(currentSnapshot);

    ignoredKeyPaths.forEach(keyPath => {
      const val = get(parsedSnapshot.mock, keyPath);
      const target = get(mock, keyPath);
      if (
        val &&
        target &&
        (typeof val === typeof target || isTimestamp(target))
      ) {
        set(mock, keyPath, val);
      }
    });
  }

  const snapshot: IClassSnapData = { className, methodName, mockName, mock };

  return {
    pass: undefined === expect(snapshot).toMatchSnapshot(snapshotTag),
    message: () => `expected ${snapshot} to match tag ${snapshotTag}`
  };
}

const isTimestamp = target => "object" === typeof target && Date.parse(target);
