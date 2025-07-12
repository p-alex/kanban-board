import { describe, it, expect, vi, beforeEach, afterEach, Mock } from "vitest";
import BestHttpRequestInterceptorManager from "./BestHttpRequestInterceptorManager.js";
import BestHttpResponseInterceptorManager from "./BestHttpResponseInterceptorManager.js";
import BestHttpFetchConfigAdapter from "./FetchConfigAdapter.js";
import BestHttpInstance from "./BestHttpInstance.js";
import BestHttpResponseException from "./exceptions/BestHttpResponseException.js";

describe("BestHttpInstance (unit)", () => {
  let fetchMock: ReturnType<typeof vi.fn>;
  let requestInterceptorMock: BestHttpRequestInterceptorManager;
  let responseInterceptorMock: BestHttpResponseInterceptorManager;
  let fetchConfigAdapterMock: BestHttpFetchConfigAdapter;
  let http: BestHttpInstance;

  beforeEach(() => {
    fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);

    requestInterceptorMock = {
      runAll: vi.fn((config) => config),
      addInterceptor: vi.fn(),
    } as unknown as BestHttpRequestInterceptorManager;

    responseInterceptorMock = {
      runAll: vi.fn((result) => result),
      addInterceptor: vi.fn(),
    } as unknown as BestHttpResponseInterceptorManager;

    fetchConfigAdapterMock = {
      adapt: vi.fn((config) => config),
    } as unknown as BestHttpFetchConfigAdapter;

    http = new BestHttpInstance(
      "https://api.unit",
      { method: "GET", headers: {} },
      requestInterceptorMock,
      responseInterceptorMock,
      fetchConfigAdapterMock
    );
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("calling addRequestInterceptor should call requestInterceptorManager with correct args", () => {
    const fn = vi.fn();
    http.addRequestInterceptor("name", fn);

    expect(requestInterceptorMock.addInterceptor).toHaveBeenCalledWith(
      "name",
      fn
    );
  });

  it("calling addResponseInterceptor should call responseInterceptorManager with correct args", () => {
    const successFn = vi.fn();
    const failFn = vi.fn();
    http.addResponseInterceptor("name", successFn, failFn);

    expect(responseInterceptorMock.addInterceptor).toHaveBeenCalledWith(
      "name",
      successFn,
      failFn
    );
  });

  it("handles text response", async () => {
    fetchMock.mockResolvedValue({
      ok: true,
      status: 200,
      headers: { get: () => "text/plain" },
      text: async () => "hello world",
    });

    const result = await http.send("/text");
    expect(result.data).toBe("hello world");
  });

  it("handles arrayBuffer response", async () => {
    const buffer = new ArrayBuffer(8);
    fetchMock.mockResolvedValue({
      ok: true,
      status: 200,
      headers: { get: () => "application/octet-stream" },
      arrayBuffer: async () => buffer,
    });

    const result = await http.send("/buffer");
    expect(result.data).toBe(buffer);
  });

  it("should return blob response by default if content type is not defined", async () => {
    const blobMock = vi.fn();
    fetchMock.mockResolvedValue({
      ok: true,
      status: 200,
      headers: { get: () => "" },
      blob: blobMock,
    });

    await http.send("");

    expect(blobMock).toHaveBeenCalled();
  });

  it("handles blob response", async () => {
    const blob = new Blob(["blob-content"], { type: "text/plain" });
    fetchMock.mockResolvedValue({
      ok: true,
      status: 200,
      headers: { get: () => "application/blob" },
      blob: async () => blob,
    });

    const result = await http.send("/blob");
    expect(result.data).toBe(blob);
  });

  it("throws BestHttpResponseException on failed response", async () => {
    fetchMock.mockResolvedValue({
      ok: false,
      status: 500,
      statusText: "Server Error",
      headers: { get: () => "application/json" },
      json: async () => ({ error: "Internal Server Error" }),
    });

    responseInterceptorMock.runAll = vi.fn((result) => ({
      ...result,
      success: false,
      errors: ["Forced failure"],
    }));

    await expect(http.send("/fail")).rejects.toThrow(BestHttpResponseException);
  });

  it("merges defaultConfig and passed config", async () => {
    (fetchConfigAdapterMock.adapt as Mock).mockReturnValue({
      headers: { "Content-Type": "application/json" },
    });
    fetchMock.mockResolvedValue({
      ok: true,
      status: 200,
      headers: { get: () => "application/json" },
      json: async () => ({ foo: "bar" }),
    });

    await http.send("/merge", { method: "POST", headers: { "X-Test": "yes" } });

    expect(requestInterceptorMock.runAll).toHaveBeenCalledWith(
      expect.objectContaining({
        method: "POST",
        headers: { "X-Test": "yes" },
        url: "/merge",
      })
    );
  });
});
