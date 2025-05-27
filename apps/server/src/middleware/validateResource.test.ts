import { Request, Response } from "express";
import { describe, expect, it, vi } from "vitest";
import validateResource from "./validateResource.js";
import { IHttpResponse } from "../interfaces/adapter/ExpressAdapter.js";

describe("validateResource.ts", () => {
  it("should handle valid resource correclty", async () => {
    const req = {
      body: { body: "body" },
      params: { params: "params" },
      query: { query: "query" },
    } as unknown as Request;

    const data = { ...req.body, ...req.params, ...req.query };

    const res = {} as unknown as Response;

    const mockSchema = {
      safeParse: vi.fn().mockReturnValue({
        data,
        success: true,
      }),
    } as any;

    const next = vi.fn();

    const middleware = validateResource(mockSchema);

    await middleware(req, res, next);

    expect(mockSchema.safeParse).toHaveBeenCalledWith(data);

    expect(next).toHaveBeenCalled();
  });

  it("should handle invalid resource correclty", async () => {
    const req = {
      body: { body: "body" },
      params: { params: "params" },
      query: { query: "query" },
    } as unknown as Request;

    const data = { ...req.body, ...req.params, ...req.query };

    const res = {
      status: vi.fn(),
      json: vi.fn(),
    } as unknown as Response;

    const mockSchema = {
      safeParse: vi.fn().mockReturnValue({
        data,
        success: false,
        error: {
          flatten: vi.fn().mockReturnValue({
            fieldErrors: {
              body: ["incorrect body"],
              params: ["incorrect params"],
              query: ["incorrect query"],
            },
          }),
        },
      }),
    } as any;

    const next = vi.fn();

    const middleware = validateResource(mockSchema);

    await middleware(req, res, next);

    expect(mockSchema.safeParse).toHaveBeenCalledWith(data);

    expect(next).not.toHaveBeenCalled();

    expect(res.json).toHaveBeenCalledWith({
      code: 401,
      success: false,
      errors: ["incorrect body", "incorrect params", "incorrect query"],
      result: null,
    } as IHttpResponse<null>);
  });
});
