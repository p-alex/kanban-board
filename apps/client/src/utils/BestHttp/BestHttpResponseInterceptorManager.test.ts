import { describe, it, expect, vi } from "vitest";
import BestHttpResponseInterceptorManager, {
  ResponseInterceptorSuccessCb,
  ResponseInterceptorErrorCb,
} from "./BestHttpResponseInterceptorManager.js";
import { IBestHttpConfig } from "./BestHttp.js";
import { IBestHttpResponse } from "./BestHttpInstance.js";

describe("BestHttpResponseInterceptorManager", () => {
  const config: IBestHttpConfig = { url: "/test" } as IBestHttpConfig;

  const successResponse: IBestHttpResponse<any> = {
    status: 200,
    success: true,
    data: { message: "OK" },
    errors: [],
  };

  const errorResponse: IBestHttpResponse<any> = {
    status: 400,
    success: false,
    data: null,
    errors: ["Bad Request"],
  };

  it("should call successCb for a successful response", async () => {
    const manager = new BestHttpResponseInterceptorManager();

    const successCb: ResponseInterceptorSuccessCb = vi.fn((response) => ({
      ...response,
      data: { modified: true },
    }));

    const errorCb: ResponseInterceptorErrorCb = vi.fn();

    manager.addInterceptor("successInterceptor", successCb, errorCb);

    const result = await manager.runAll(successResponse, config);

    expect(successCb).toHaveBeenCalledWith(successResponse);
    expect(errorCb).not.toHaveBeenCalled();
    expect(result.data).toEqual({ modified: true });
  });

  it("should call errorCb for a failed response", async () => {
    const manager = new BestHttpResponseInterceptorManager();

    const successCb: ResponseInterceptorSuccessCb = vi.fn();
    const errorCb: ResponseInterceptorErrorCb = vi.fn((response) => ({
      ...response,
      errors: ["Handled Error"],
    }));

    manager.addInterceptor("errorInterceptor", successCb, errorCb);

    const result = await manager.runAll(errorResponse, config);

    expect(successCb).not.toHaveBeenCalled();
    expect(errorCb).toHaveBeenCalledWith(errorResponse, config);
    expect(result.errors).toEqual(["Handled Error"]);
  });

  it("should run multiple interceptors in order", async () => {
    const manager = new BestHttpResponseInterceptorManager();

    const firstSuccessCb: ResponseInterceptorSuccessCb = vi.fn((response) => ({
      ...response,
      data: { step: 1 },
    }));
    const secondSuccessCb: ResponseInterceptorSuccessCb = vi.fn((response) => ({
      ...response,
      data: { ...response.data, step: 2 },
    }));

    const errorCb: ResponseInterceptorErrorCb = vi.fn();

    manager.addInterceptor("first", firstSuccessCb, errorCb);
    manager.addInterceptor("second", secondSuccessCb, errorCb);

    const result = await manager.runAll(successResponse, config);

    expect(firstSuccessCb).toHaveBeenCalledTimes(1);
    expect(secondSuccessCb).toHaveBeenCalledTimes(1);
    expect(result.data).toEqual({ step: 2 });
  });

  it("should eject an interceptor and not call it", async () => {
    const manager = new BestHttpResponseInterceptorManager();

    const successCb: ResponseInterceptorSuccessCb = vi.fn((response) => ({
      ...response,
      data: { step: "should not run" },
    }));
    const errorCb: ResponseInterceptorErrorCb = vi.fn();

    const interceptor = manager.addInterceptor("toRemove", successCb, errorCb);

    interceptor.eject();

    const result = await manager.runAll(successResponse, config);

    expect(successCb).not.toHaveBeenCalled();
    expect(result.data).toEqual(successResponse.data); // original unchanged
  });

  it("should handle async successCb and errorCb", async () => {
    const manager = new BestHttpResponseInterceptorManager();

    const asyncSuccessCb: ResponseInterceptorSuccessCb = vi.fn(async (res) => {
      return {
        ...res,
        data: { async: true },
      };
    });

    const asyncErrorCb: ResponseInterceptorErrorCb = vi.fn(async (res) => {
      return {
        ...res,
        errors: ["async error"],
      };
    });

    manager.addInterceptor("async", asyncSuccessCb, asyncErrorCb);

    const successResult = await manager.runAll(successResponse, config);
    expect(successResult.data).toEqual({ async: true });

    const errorResult = await manager.runAll(errorResponse, config);
    expect(errorResult.errors).toEqual(["async error"]);
  });
});
