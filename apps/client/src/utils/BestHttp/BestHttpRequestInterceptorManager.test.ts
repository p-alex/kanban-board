import { describe, it, expect, vi, beforeEach } from "vitest";
import BestHttpRequestInterceptorManager from "./BestHttpRequestInterceptorManager.js";
import { IBestHttpConfig } from "./BestHttp.js";

describe("BestHttpRequestInterceptorManager", () => {
  let manager: BestHttpRequestInterceptorManager;
  let baseConfig: IBestHttpConfig;

  beforeEach(() => {
    manager = new BestHttpRequestInterceptorManager();
    baseConfig = {
      url: "/test",
      headers: { "Content-Type": "application/json" },
      method: "get",
    } as IBestHttpConfig;
  });

  it("should add an interceptor and return it", () => {
    const mockFn = vi.fn((config) => ({
      ...config,
      headers: { "X-Test": "1" },
    }));
    const interceptor = manager.addInterceptor("testInterceptor", mockFn);

    expect(interceptor).toHaveProperty("name", "testInterceptor");
    expect(typeof interceptor.run).toBe("function");
    expect(typeof interceptor.eject).toBe("function");
  });

  it("should call interceptor function during runAll and modify config", () => {
    const mockFn = vi.fn((config) => ({
      ...config,
      headers: { ...config.headers, Authorization: "Bearer token" },
    }));

    manager.addInterceptor("authInterceptor", mockFn);

    const resultConfig = manager.runAll(baseConfig);

    expect(mockFn).toHaveBeenCalledOnce();
    expect(mockFn).toHaveBeenCalledWith(baseConfig);
    expect(resultConfig.headers.Authorization).toBe("Bearer token");
  });

  it("should apply multiple interceptors in order", () => {
    const firstFn = vi.fn((config) => ({
      ...config,
      headers: { ...config.headers, "X-First": "1" },
    }));
    const secondFn = vi.fn((config) => ({
      ...config,
      method: "post",
    }));

    manager.addInterceptor("first", firstFn);
    manager.addInterceptor("second", secondFn);

    const resultConfig = manager.runAll(baseConfig);

    expect(firstFn).toHaveBeenCalledBefore(secondFn);
    expect(resultConfig.headers["X-First"]).toBe("1");
    expect(resultConfig.method).toBe("post");
  });

  it("should remove an interceptor when eject is called", () => {
    const mockFn = vi.fn((config) => config);
    const interceptor = manager.addInterceptor("removable", mockFn);

    interceptor.eject();

    const resultConfig = manager.runAll(baseConfig);

    expect(mockFn).not.toHaveBeenCalled();
    expect(resultConfig).toEqual(baseConfig);
  });

  it("should do nothing if no interceptors are added", () => {
    const resultConfig = manager.runAll(baseConfig);
    expect(resultConfig).toEqual(baseConfig);
  });

  it("should not affect remaining interceptors after ejecting one", () => {
    const firstFn = vi.fn((config) => ({
      ...config,
      headers: { ...config.headers, "X-First": "1" },
    }));
    const secondFn = vi.fn((config) => ({
      ...config,
      method: "PUT",
    }));

    const firstInterceptor = manager.addInterceptor("first", firstFn);
    manager.addInterceptor("second", secondFn);

    firstInterceptor.eject();

    const resultConfig = manager.runAll(baseConfig);

    expect(firstFn).not.toHaveBeenCalled();
    expect(secondFn).toHaveBeenCalled();
    expect(resultConfig.method).toBe("PUT");
    expect(resultConfig.headers["X-First"]).toBeUndefined();
  });
});
