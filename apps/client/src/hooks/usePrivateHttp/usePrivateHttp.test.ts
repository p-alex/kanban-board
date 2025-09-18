import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook } from "@testing-library/react";
import usePrivateHttp from "./usePrivateHttp.js";

// --- hoisted mocks ---
const {
  mockRequestUse,
  mockResponseUse,
  mockEject,
  mockPrivateHttp,
  mockRefreshSession,
  mockUseAuthContext,
} = vi.hoisted(() => ({
  mockRequestUse: vi.fn(),
  mockResponseUse: vi.fn(),
  mockEject: vi.fn(),
  mockPrivateHttp: vi.fn(), // callable like Axios instance
  mockRefreshSession: vi.fn(),
  mockUseAuthContext: vi.fn(),
}));

// --- module mocks ---
vi.mock("../useAuthContext/useAuthContext", () => ({
  default: () => mockUseAuthContext(),
}));

vi.mock(
  "../../api/usecases/auth/RefreshSessionUsecase/useRefreshSession",
  () => ({
    default: () => mockRefreshSession,
  })
);

vi.mock("../../api", () => {
  mockPrivateHttp.interceptors = {
    request: { use: mockRequestUse, eject: mockEject },
    response: { use: mockResponseUse, eject: mockEject },
  };
  return { privateHttp: mockPrivateHttp };
});

describe("usePrivateHttp", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseAuthContext.mockReturnValue({ accessToken: "mockAccessToken" });
  });

  it("registers request and response interceptors on mount", () => {
    renderHook(() => usePrivateHttp());
    expect(mockRequestUse).toHaveBeenCalledWith(expect.any(Function), null);
    expect(mockResponseUse).toHaveBeenCalledWith(
      expect.any(Function),
      expect.any(Function)
    );
  });

  it("adds Authorization header if missing", () => {
    let requestInterceptor: (config: any) => any = (c) => c;
    mockRequestUse.mockImplementation((fn) => {
      requestInterceptor = fn;
      return 1;
    });

    renderHook(() => usePrivateHttp());

    const config = { headers: {} as Record<string, string> };
    const result = requestInterceptor(config);
    expect(result.headers.Authorization).toBe("Bearer mockAccessToken");
  });

  it("returns response unchanged in success interceptor", () => {
    let successInterceptor: (res: any) => any = (r) => r;
    mockResponseUse.mockImplementation((success, _error) => {
      successInterceptor = success;
      return 2;
    });

    renderHook(() => usePrivateHttp());

    const mockResponse = { status: 200, data: "ok" };
    const result = successInterceptor(mockResponse);
    expect(result).toBe(mockResponse);
  });

  it("retries request if response is 401 and refreshSession succeeds", async () => {
    let errorInterceptor: (err: any) => Promise<any> = async (e) => e;
    mockResponseUse.mockImplementation((_success, error) => {
      errorInterceptor = error;
      return 3;
    });

    renderHook(() => usePrivateHttp());

    const mockConfig = {
      url: "/test",
      headers: {} as Record<string, string>,
      wasSent: undefined,
    };

    mockRefreshSession.mockResolvedValue({
      isSuccess: true,
      data: { data: { newAccessToken: "newAccessToken" } },
    });

    mockPrivateHttp.mockResolvedValue({ data: "success" });

    const axiosError: any = { response: { status: 401 }, config: mockConfig };

    const result = await errorInterceptor(axiosError);

    expect(mockRefreshSession).toHaveBeenCalled();
    expect(mockConfig.headers.Authorization).toBe("Bearer newAccessToken");
    expect(mockPrivateHttp).toHaveBeenCalledWith(mockConfig);
    expect(result).toEqual({ data: "success" });
  });

  it("returns rejected promise for non-401 errors", async () => {
    let errorInterceptor: (err: any) => Promise<any> = async (e) => e;
    mockResponseUse.mockImplementation((_success, error) => {
      errorInterceptor = error;
      return 5;
    });

    renderHook(() => usePrivateHttp());

    const axiosError: any = { response: { status: 500 }, config: {} };

    const result = await errorInterceptor(axiosError).catch((e) => e);
    expect(result).toBe(axiosError);
    expect(mockRefreshSession).not.toHaveBeenCalled();
    expect(mockPrivateHttp).not.toHaveBeenCalled();
  });

  it("ejects interceptors on unmount", () => {
    const { unmount } = renderHook(() => usePrivateHttp());
    unmount();
    expect(mockEject).toHaveBeenCalledTimes(2); // request + response
  });
});
