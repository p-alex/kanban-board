import { beforeEach, describe, expect, it, Mocked, vi } from "vitest";
import BestHttpFetchConfigAdapter from "./FetchConfigAdapter.js";
import BodyHandler from "./BodyHandler/BodyHandler.js";
import { IBestHttpConfig } from "./BestHttp.js";

describe("FetchConfigAdapter.ts", () => {
  let bodyHandlerMock: Mocked<BodyHandler>;
  let fetchConfigAdapter: BestHttpFetchConfigAdapter;

  let testConfig: IBestHttpConfig;

  beforeEach(() => {
    testConfig = {
      url: "",
      body: undefined,
      headers: {
        "Content-Type": "application/json",
      },
      method: "get",
      withCredentials: false,
      wasSent: undefined,
    };
    bodyHandlerMock = { handle: vi.fn() } as unknown as Mocked<BodyHandler>;
    fetchConfigAdapter = new BestHttpFetchConfigAdapter(bodyHandlerMock);
  });

  it("should set body to undefined if method is GET", () => {
    testConfig.body = { test: "test" };

    const result = fetchConfigAdapter.adapt(testConfig);

    expect(result.body).toBeUndefined();
  });

  it("should handle body correctly if method is anything other then GET", () => {
    testConfig.method = "post";
    testConfig.body = { test: "test" };

    fetchConfigAdapter.adapt(testConfig);

    expect(bodyHandlerMock.handle).toHaveBeenCalledWith(
      testConfig.headers["Content-Type"],
      testConfig.body
    );
  });

  it("should set credentials to 'omit' if withCredentials is set to false", () => {
    testConfig.withCredentials = false;

    const result = fetchConfigAdapter.adapt(testConfig);

    expect(result.credentials).toBe("omit");
  });

  it("should set credentials to 'include' if withCredentials is set to false", () => {
    testConfig.withCredentials = true;

    const result = fetchConfigAdapter.adapt(testConfig);

    expect(result.credentials).toBe("include");
  });
});
