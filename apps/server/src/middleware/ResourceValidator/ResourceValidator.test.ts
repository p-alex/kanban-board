import { beforeEach, describe, expect, it, Mock, Mocked, vi } from "vitest";
import { SafeParseReturnType, ZodSchema } from "zod";
import {
  IHttpRequest,
  IMiddlewareResponse,
} from "../../interfaces/adapter/index.js";
import ResourceValidator from "./ResourceValidator.js";

describe("ResourceValidator.ts", () => {
  let zodSchemaMock: ZodSchema;

  let httpReqMock: IHttpRequest = {
    body: { body: "body" },
    params: { params: "params" },
    query: { query: "query" },
    client_ip: "ip",
    method: "POST",
    url: "/url",
  };

  let resourceValidator: ResourceValidator;

  let safeParseResultMock: Mocked<SafeParseReturnType<any, any>>;

  beforeEach(() => {
    safeParseResultMock = {
      success: true,
      error: {
        flatten: vi.fn().mockReturnValue({
          fieldErrors: { error1: ["error1"], error2: ["error2"] },
        }),
      },
    } as unknown as Mocked<SafeParseReturnType<any, any>>;

    zodSchemaMock = {
      safeParse: vi.fn().mockReturnValue(safeParseResultMock),
    } as unknown as Mocked<ZodSchema>;

    resourceValidator = new ResourceValidator();
  });

  it("should handle correct resource", async () => {
    safeParseResultMock.success = true;

    const middleware = resourceValidator.validate(zodSchemaMock);

    const result = await middleware(httpReqMock);

    const successResponse: IMiddlewareResponse = {
      success: true,
      errorCode: 0,
      headers: {},
      errors: [],
    };

    const data = {
      body: "body",
      params: "params",
      query: "query",
    };

    expect(zodSchemaMock.safeParse).toHaveBeenCalledWith(data);
    expect(result).toEqual(successResponse);
  });

  it("should handle incorrect resource", async () => {
    safeParseResultMock.success = false;

    const middleware = resourceValidator.validate(zodSchemaMock);

    const result = await middleware(httpReqMock);

    const failedResponse: IMiddlewareResponse = {
      success: false,
      errorCode: 400,
      headers: {},
      errors: ["error1", "error2"],
    };

    expect(result).toEqual(failedResponse);
  });
});
