import { has, set } from "lodash";
import { SourceFile } from "ts-simple-ast";
import { IClassSnapData, IClassSnapshot, ISnapshot } from "../contracts";
import { ClassSnapshotTag } from "../matchers/ClassMockMatcher";
import { MockGenerator } from "./base";

export class ClassSpyGenerator extends MockGenerator {
  generate(
    getFile: (filename: string) => SourceFile,
    allSnapshots: ISnapshot[]
  ) {
    classTree
  }

  filterSnapshots(allSnapshots: ISnapshot[]): IClassSnapshot[] {
    return allSnapshots.filter(snap => snap.key.includes(ClassSnapshotTag));
  }

}

interface MockshotMock<P, T = {}> extends jest.Mock {
  give(mockName: P): jest.Mock<T>;
  giveOnce(mockName: P): jest.Mock<T>;
}

function getSpy<P extends string>(methodName) {
  const newSpy = jest.fn() as MockshotMock<P>;
  newSpy.give = mockName =>
    newSpy.mockImplementation(() =>
      JobActionsServiceMocks[methodName](mockName)
    );
  newSpy.giveOnce = mockName =>
    newSpy.mockImplementationOnce(() =>
      JobActionsServiceMocks[methodName](mockName)
    );
  return newSpy;
}

export const jobActionsServiceSpy: {
  duplicateJob: MockshotMock<"success" | "fail">;
} = {
  duplicateJob: getSpy("duplicateJob")
};

jobActionsServiceSpy.duplicateJob.give("success");
jobActionsServiceSpy.duplicateJob.giveOnce("fail");
