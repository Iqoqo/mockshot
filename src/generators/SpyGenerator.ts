interface MockshotMock<P, T = {}> extends jest.Mock {
  give(mockName: P): jest.Mock<T>;
  giveOnce(mockName: P): jest.Mock<T>;
}

function getSpy<P extends string>(methodName) {
  const newSpy = jest.fn() as MockshotMock<P>
  newSpy.give = (mockName) => newSpy.mockImplementation(() => JobActionsServiceMocks[methodName](mockName))
  newSpy.giveOnce = (mockName) => newSpy.mockImplementationOnce(() => JobActionsServiceMocks[methodName](mockName))
  return newSpy
}

export const jobActionsServiceSpy: {duplicateJob: MockshotMock<"success" | "fail">} = {
  duplicateJob: getSpy("duplicateJob")
}

jobActionsServiceSpy.duplicateJob.give("success")
jobActionsServiceSpy.duplicateJob.giveOnce("fail")