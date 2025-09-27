import { beforeEach, describe, expect, it, vi } from "vitest";
import { z, ZodSchema } from "zod";
import ResourceValidator from "./ResourceValidator.js";
import HttpResponseFactory from "../../HttpResponseFactory/HttpResponseFactory.js";
import {
  httpRequestFactory,
  IHttpRequest,
} from "../../interfaces/adapter/index.js";

describe("ResourceValidator.ts", () => {
  let mockHttpReq: IHttpRequest;
  let httpResponseFactory: HttpResponseFactory;
  let resourceValidator: ResourceValidator;

  beforeEach(() => {
    mockHttpReq = httpRequestFactory();
    mockHttpReq.body = { email: "test@example.com" };
    mockHttpReq.params = { id: "123" };
    mockHttpReq.query = { page: "1" };

    httpResponseFactory = {
      success: vi.fn().mockReturnValue({
        code: 200,
        errors: [],
        result: null,
        success: true,
      }),
      error: vi.fn().mockImplementation((code, errors) => ({
        code,
        errors,
        result: null,
        success: false,
      })),
    } as unknown as HttpResponseFactory;

    resourceValidator = new ResourceValidator(httpResponseFactory);
  });

  it("should call schema.safeParse with merged body, params, and query", async () => {
    const schema = z.object({
      email: z.string().email(),
      id: z.string(),
      page: z.string(),
    });

    const safeParseSpy = vi.spyOn(schema, "safeParse");

    const validateFn = resourceValidator.validate(schema);
    await validateFn(mockHttpReq);

    expect(safeParseSpy).toHaveBeenCalledWith({
      email: "test@example.com",
      id: "123",
      page: "1",
    });
  });

  it("should set validated data on httpReq.body if validation succeeds", async () => {
    const schema = z.object({
      email: z.string().email(),
      id: z.string(),
      page: z.string(),
    });

    const validateFn = resourceValidator.validate(schema);
    await validateFn(mockHttpReq);

    expect(mockHttpReq.body).toEqual({
      email: "test@example.com",
      id: "123",
      page: "1",
    });
  });

  it("should return success response if validation succeeds", async () => {
    const schema = z.object({
      email: z.string().email(),
      id: z.string(),
      page: z.string(),
    });

    const validateFn = resourceValidator.validate(schema);
    const result = await validateFn(mockHttpReq);

    expect(result.response).toEqual({
      code: 200,
      errors: [],
      result: null,
      success: true,
    });
  });

  it("should return error response with validation errors if validation fails", async () => {
    const schema = z.object({
      email: z.string().email(),
      id: z.number(),
    });

    const validateFn = resourceValidator.validate(schema);
    const result = await validateFn(mockHttpReq);

    expect(result.response).toEqual({
      code: 400,
      errors: expect.arrayContaining([
        expect.stringContaining("Expected number"),
      ]),
      result: null,
      success: false,
    });
  });
});
