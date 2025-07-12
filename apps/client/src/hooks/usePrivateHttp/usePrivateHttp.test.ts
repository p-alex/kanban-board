import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook } from "@testing-library/react";
import usePrivateHttp from "./usePrivateHttp.js";
import BestHttpInstance from "../../utils/BestHttp/BestHttpInstance.js";

vi.mock("../useAuthContext/useAuthContext", () => ({
  default: () => ({
    accessToken: "mockAccessToken",
  }),
}));

const mockRefreshSession = vi.fn();
vi.mock(
  "../../api/usecases/auth/RefreshSessionUsecase/useRefreshSession",
  () => ({
    default: () => mockRefreshSession,
  })
);

const mockSend = vi.fn();
const mockAddRequestInterceptor = vi.fn();
const mockAddResponseInterceptor = vi.fn();
const mockEject = vi.fn();

const fakeHttp = {
  addRequestInterceptor: mockAddRequestInterceptor,
  addResponseInterceptor: mockAddResponseInterceptor,
  send: mockSend,
};

beforeEach(() => {
  vi.clearAllMocks();

  mockAddRequestInterceptor.mockReturnValue({ eject: mockEject });
  mockAddResponseInterceptor.mockReturnValue({ eject: mockEject });
});

describe("usePrivateHttp", () => {
  it("registers request and response interceptors on mount", () => {
    renderHook(() =>
      usePrivateHttp({ http: fakeHttp as unknown as BestHttpInstance })
    );

    expect(mockAddRequestInterceptor).toHaveBeenCalledWith(
      "accessToken interceptor",
      expect.any(Function)
    );
    expect(mockAddResponseInterceptor).toHaveBeenCalledWith(
      "retry if access token expired interceptor",
      expect.any(Function),
      expect.any(Function)
    );
  });

  it("returns response unchanged in success interceptor", () => {
    let successInterceptor: (result: any) => any = ({}) => {};

    mockAddResponseInterceptor.mockImplementation((_name, success, error) => {
      successInterceptor = success;
      return { eject: mockEject };
    });

    renderHook(() =>
      usePrivateHttp({ http: fakeHttp as unknown as BestHttpInstance })
    );

    const mockResponse = { status: 200, data: "ok" };
    const result = successInterceptor(mockResponse);

    expect(result).toBe(mockResponse);
  });

  it("ejects interceptors on unmount", () => {
    const { unmount } = renderHook(() =>
      usePrivateHttp({ http: fakeHttp as unknown as BestHttpInstance })
    );

    unmount();

    expect(mockEject).toHaveBeenCalledTimes(2);
  });

  it("adds Authorization header if missing", () => {
    let requestInterceptorFn: (config: any) => any = ({}) => {};

    mockAddRequestInterceptor.mockImplementation((_name, fn) => {
      requestInterceptorFn = fn;
      return { eject: mockEject };
    });

    renderHook(() =>
      usePrivateHttp({ http: fakeHttp as unknown as BestHttpInstance })
    );

    const config = { headers: {} };
    const result = requestInterceptorFn(config);

    expect(result.headers.Authorization).toBe("Bearer mockAccessToken");
  });

  it("retries request if response is 401 and refreshSession succeeds", async () => {
    let responseErrorInterceptorFn: (
      result: any,
      config: any
    ) => Promise<any> = ({}, {}) => Promise.resolve();

    mockAddResponseInterceptor.mockImplementation((_name, success, errorFn) => {
      responseErrorInterceptorFn = errorFn;
      return { eject: mockEject };
    });

    renderHook(() =>
      usePrivateHttp({ http: fakeHttp as unknown as BestHttpInstance })
    );

    const mockConfig = { url: "/test", headers: {}, wasSent: undefined };

    mockRefreshSession.mockResolvedValue({
      accessToken: "newAccessToken",
    });

    mockSend.mockResolvedValue({ data: "success" });

    const errorResponse = {
      status: 401,
      errors: [{ message: "Unauthorized" }],
    };

    const result = await responseErrorInterceptorFn(errorResponse, mockConfig);

    expect(mockRefreshSession).toHaveBeenCalled();
    expect(mockSend).toHaveBeenCalledWith("/test", {
      ...mockConfig,
      headers: { Authorization: "Bearer newAccessToken" },
    });
    expect(result).toEqual({ data: "success" });
  });

  it("does not retry if refreshSession fails", async () => {
    let responseErrorInterceptorFn: (
      result: any,
      config: any
    ) => Promise<any> = ({}, {}) => Promise.resolve();

    mockAddResponseInterceptor.mockImplementation((_name, success, errorFn) => {
      responseErrorInterceptorFn = errorFn;
      return { eject: mockEject };
    });

    renderHook(() =>
      usePrivateHttp({ http: fakeHttp as unknown as BestHttpInstance })
    );

    const mockConfig = { url: "/test", headers: {}, wasSent: undefined };

    mockRefreshSession.mockResolvedValue(null);

    const errorResponse = {
      status: 401,
      errors: [{ message: "Unauthorized" }],
    };

    await expect(
      responseErrorInterceptorFn(errorResponse, mockConfig)
    ).rejects.toEqual("error");

    expect(mockRefreshSession).toHaveBeenCalled();
    expect(mockSend).not.toHaveBeenCalled();
  });

  it("rejects with original error for other status codes", async () => {
    let responseErrorInterceptorFn: (
      result: any,
      config: any
    ) => Promise<any> = ({}, {}) => Promise.resolve();

    mockAddResponseInterceptor.mockImplementation((_name, success, errorFn) => {
      responseErrorInterceptorFn = errorFn;
      return { eject: mockEject };
    });

    renderHook(() =>
      usePrivateHttp({ http: fakeHttp as unknown as BestHttpInstance })
    );

    const errorResponse = {
      status: 500,
      errors: [{ message: "Server error" }],
    };

    await expect(responseErrorInterceptorFn(errorResponse, {})).rejects.toEqual(
      { message: "Server error" }
    );

    expect(mockRefreshSession).not.toHaveBeenCalled();
    expect(mockSend).not.toHaveBeenCalled();
  });
});
