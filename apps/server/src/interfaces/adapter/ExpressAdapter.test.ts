import { describe, it, vi, expect } from "vitest";
import { Request, Response } from "express";
import ExpressAdapter, {
  IHttpRequest,
  IHttpResponse,
} from "./ExpressAdapter.js";
import AppException from "../../exceptions/AppException.js";

describe("ExpressAdapter", () => {
  it("should correctly adapt the controller response to Express", async () => {
    // Mock Express request and response objects
    const req = {
      body: { name: "John" },
      params: { id: "123" },
      query: { search: "test" },
    } as unknown as Request;

    const res = {
      json: vi.fn(), // Mock res.json
    } as unknown as Response;

    // Mock controller function
    const mockController = vi.fn(async (httpRequest: IHttpRequest) => {
      return {
        code: 200,
        success: true,
        result: { message: "Hello, John!" },
        errors: [],
      } as IHttpResponse<{ message: string }>;
    });

    // Create adapter instance
    const adapter = new ExpressAdapter();
    const adaptedHandler = adapter.adapt(mockController);

    // Call the adapted function
    await adaptedHandler(req, res);

    // Assertions
    expect(mockController).toHaveBeenCalledWith({
      body: { name: "John" },
      params: { id: "123" },
      query: { search: "test" },
    });

    expect(res.json).toHaveBeenCalledWith({
      code: 200,
      success: true,
      result: { message: "Hello, John!" },
      errors: [],
    });
  });

  it("should handle other errors correctly", async () => {
    const req = {
      body: {},
      params: {},
      query: {},
    } as unknown as Request;

    const res = {
      json: vi.fn(),
      status: vi.fn(),
    } as unknown as Response;

    const response: IHttpResponse<null> = {
      code: 500,
      errors: ["Something went wrong. Please try again later."],
      result: null,
      success: false,
    };

    const controllerMock = vi.fn(() => {
      throw new Error("other error");
    });

    const adapter = new ExpressAdapter();
    const adaptedHandler = adapter.adapt(controllerMock);

    await adaptedHandler(req, res);

    expect(res.json).toHaveBeenCalledWith(response);
  });

  it("should handle app exceptions correctly", async () => {
    const req = {
      body: {},
      params: {},
      query: {},
    } as unknown as Request;

    const res = {
      json: vi.fn(),
      status: vi.fn(),
    } as unknown as Response;

    const response: IHttpResponse<null> = {
      code: 400,
      errors: ["Bad Request"],
      result: null,
      success: false,
    };

    const controllerMock = vi.fn(() => {
      throw new AppException(400, "Bad Request");
    });

    const adapter = new ExpressAdapter();
    const adaptedHandler = adapter.adapt(controllerMock);

    await adaptedHandler(req, res);

    expect(res.json).toHaveBeenCalledWith(response);
  });
});
