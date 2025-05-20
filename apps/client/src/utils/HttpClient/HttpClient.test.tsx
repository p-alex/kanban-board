import { Mock } from "vitest";
import HttpClient from "./HttpClient";

describe("HttpClient.ts", () => {
  let httpClient: HttpClient;

  beforeEach(() => {
    httpClient = new HttpClient("/api");
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("should apply default options to requests if none provided", async () => {
    const mockFetch = vi.fn(() =>
      Promise.resolve({ ok: true, json: () => Promise.resolve(null) })
    );

    global.fetch = mockFetch as Mock;

    await httpClient.query("/");

    expect(mockFetch).toHaveBeenCalledWith("/api/", {
      credentials: "omit",
      headers: { "Content-Type": "application/json", Authorization: "" },
    });
  });

  it("should apply options correctly", async () => {
    const mockFetch = vi.fn(() =>
      Promise.resolve({ ok: true, json: () => Promise.resolve(null) })
    );

    global.fetch = mockFetch as Mock;

    await httpClient.query("/", {
      credentials: "include",
      headers: { "Content-Type": "text/html", Authorization: "Bearer token" },
    });

    expect(mockFetch).toHaveBeenCalledWith("/api/", {
      credentials: "include",
      headers: { "Content-Type": "text/html", Authorization: "Bearer token" },
    });
  });

  it("query function should return result", async () => {
    const mockFetch = vi.fn(() => {
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ data: "data" }),
      });
    }) as Mock;

    global.fetch = mockFetch;

    const result = await httpClient.query<{ data: "data" }>("/");

    expect(result).toEqual({ data: "data" });
  });

  it("query function throws if request fails", async () => {
    const mockFetch = vi.fn(() => {
      return Promise.resolve({
        ok: false,
        json: () => Promise.resolve({ data: "data" }),
      });
    }) as Mock;

    global.fetch = mockFetch;

    await expect(httpClient.query<{ data: "data" }>("/")).rejects.toThrow();
  });

  it("mutate function and returns the result", async () => {
    const mockFetch = vi.fn(() => {
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ data: "data" }),
      });
    }) as Mock;

    global.fetch = mockFetch;

    const result: { data: "data" } = await httpClient.mutate("/", "POST");

    expect(result).toEqual({ data: "data" });
  });

  it("mutate function throws if request fails", async () => {
    const mockFetch = vi.fn(() => {
      return Promise.resolve({
        ok: false,
        json: () => Promise.resolve({ data: "data" }),
      });
    }) as Mock;

    global.fetch = mockFetch;

    await expect(httpClient.mutate("/", "POST")).rejects.toThrow();
  });
});
