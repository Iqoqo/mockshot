import { IClassSnapshot } from "../../src/contracts";
import { noPackageName, parseClassSnapshots } from "../../src/generators/parsers";

describe("parseClassSnapshots()", () => {
  it("should parse class snapshots into class tree", () => {
    const snapshots: IClassSnapshot[] = [
      mockSnapObjectA,
      mockSnapObjectB,
      mockSnapObjectC
    ];
    const result = parseClassSnapshots(snapshots);

    expect(result).toEqual(parseTreeResult);
  });

  it("should parse snapshots with no package name", () => {
    const snapshots: IClassSnapshot[] = [
      mockSnapObjectA,
      mockSnapObjectNoPackage
    ];
    const result = parseClassSnapshots(snapshots);

    expect(result).toEqual(parseNoPackageNameResult);
  });

  it("should not conflict to snapshots from different packages", () => {
    const snapshots: IClassSnapshot[] = [mockSnapObjectA, mockSnapObjectD];
    const result = parseClassSnapshots(snapshots);

    expect(result).toEqual(paseFromDifferentPackagesResult);
  });

  it("should throw error for package duplication", () => {
    const snapshots: IClassSnapshot[] = [
      mockSnapObjectA,
      mockSnapObjectB,
      mockSnapObjectA
    ];
    expect(() => parseClassSnapshots(snapshots)).toThrowError(
      "Duplicate mock name on class: UserService for method getUser: success"
    );
  });
});

const parseTreeResult = {
  mockshot: {
    UserService: {
      getUser: {
        fail: {
          meta: {
            key:
              "Class mock: [mockshot] [ClassSnap] [[TestClass getSomeObject ok]] 1",
            originFile:
              "/projects/mockshot/test/__snapshots__/index.spec.ts.snap"
          },
          mock: "user could not be found"
        },
        success: {
          meta: {
            key:
              "Class mock: [mockshot] [ClassSnap] [[TestClass getSomeObject ok]] 1",
            originFile:
              "/projects/mockshot/test/__snapshots__/index.spec.ts.snap"
          },
          mock: { email: "john@google.com", userName: "john" }
        }
      },
      getUsers: {
        success: {
          meta: {
            key:
              "Class mock: [mockshot] [ClassSnap] [[TestClass getSomeObject ok]] 1",
            originFile:
              "/projects/mockshot/test/__snapshots__/index.spec.ts.snap"
          },
          mock: [{ email: "john@google.com", userName: "john" }]
        }
      }
    }
  }
};

const mockSnapObjectA = {
  key: "Class mock: [mockshot] [ClassSnap] [[TestClass getSomeObject ok]] 1",
  packageName: "mockshot",
  filePath: "/projects/mockshot/test/__snapshots__/index.spec.ts.snap",
  data: {
    className: "UserService",
    methodName: "getUser",
    mockName: "success",
    mock: { userName: "john", email: "john@google.com" }
  }
};

const mockSnapObjectB = {
  key: "Class mock: [mockshot] [ClassSnap] [[TestClass getSomeObject ok]] 1",
  packageName: "mockshot",
  filePath: "/projects/mockshot/test/__snapshots__/index.spec.ts.snap",
  data: {
    className: "UserService",
    methodName: "getUsers",
    mockName: "success",
    mock: [{ userName: "john", email: "john@google.com" }]
  }
};

const mockSnapObjectC = {
  key: "Class mock: [mockshot] [ClassSnap] [[TestClass getSomeObject ok]] 1",
  packageName: "mockshot",
  filePath: "/projects/mockshot/test/__snapshots__/index.spec.ts.snap",
  data: {
    className: "UserService",
    methodName: "getUser",
    mockName: "fail",
    mock: "user could not be found"
  }
};

const mockSnapObjectD = {
  key: "Class mock: [mockshot] [ClassSnap] [[TestClass getSomeObject ok]] 1",
  packageName: "jest",
  filePath: "/projects/mockshot/test/__snapshots__/index.spec.ts.snap",
  data: {
    className: "UserService",
    methodName: "getUser",
    mockName: "success",
    mock: { userName: "john", email: "john@google.com" }
  }
};

const mockSnapObjectNoPackage = {
  key: "Class mock: [mockshot] [ClassSnap] [[TestClass getSomeObject ok]] 1",
  filePath: "/projects/mockshot/test/__snapshots__/index.spec.ts.snap",
  data: {
    className: "UserService",
    methodName: "getUser",
    mockName: "success",
    mock: { userName: "john", email: "john@google.com" }
  }
};

const parseNoPackageNameResult = {
  mockshot: {
    UserService: {
      getUser: {
        success: {
          meta: {
            key:
              "Class mock: [mockshot] [ClassSnap] [[TestClass getSomeObject ok]] 1",
            originFile:
              "/projects/mockshot/test/__snapshots__/index.spec.ts.snap"
          },
          mock: { email: "john@google.com", userName: "john" }
        }
      }
    }
  },
  [noPackageName]: {
    UserService: {
      getUser: {
        success: {
          meta: {
            key:
              "Class mock: [mockshot] [ClassSnap] [[TestClass getSomeObject ok]] 1",
            originFile:
              "/projects/mockshot/test/__snapshots__/index.spec.ts.snap"
          },
          mock: { email: "john@google.com", userName: "john" }
        }
      }
    }
  }
};

const paseFromDifferentPackagesResult = {
  mockshot: {
    UserService: {
      getUser: {
        success: {
          meta: {
            key:
              "Class mock: [mockshot] [ClassSnap] [[TestClass getSomeObject ok]] 1",
            originFile:
              "/projects/mockshot/test/__snapshots__/index.spec.ts.snap"
          },
          mock: { email: "john@google.com", userName: "john" }
        }
      }
    }
  },
  jest: {
    UserService: {
      getUser: {
        success: {
          meta: {
            key:
              "Class mock: [mockshot] [ClassSnap] [[TestClass getSomeObject ok]] 1",
            originFile:
              "/projects/mockshot/test/__snapshots__/index.spec.ts.snap"
          },
          mock: { email: "john@google.com", userName: "john" }
        }
      }
    }
  }
};
