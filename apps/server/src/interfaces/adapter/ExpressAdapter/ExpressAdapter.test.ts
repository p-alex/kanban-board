import { beforeEach, describe, expect, it, Mock, Mocked, vi } from "vitest";
import ExpressAdapter from "./ExpressAdapter.js";
import HttpResponseFactory from "../../../HttpResponseFactory/HttpResponseFactory.js";
import {
  CustomRequest,
  ICookie,
  IHandlerResponse,
  IHttpResponse,
} from "../index.js";
import { NextFunction, Response } from "express";
import AppException from "../../../exceptions/AppException.js";

describe("ExpressAdapter.ts", () => {
  let testHandlerResponse: IHandlerResponse<null>;
  let mockHandler: Mock;
  let mockReq: CustomRequest;
  let mockRes: Response;
  let nextFn: Mocked<NextFunction>;

  let httpResponseFactory: Mocked<HttpResponseFactory>;
  let expressAdapter: ExpressAdapter;

  beforeEach(() => {
    testHandlerResponse = {
      response: {
        code: 200,
        errors: [],
        result: null,
        success: true,
      },
      headers: undefined,
      cookies: undefined,
    };

    mockHandler = vi.fn();

    mockReq = {
      body: undefined,
      params: {},
      query: {},
      url: "/url",
      method: "get",
      ip: "",
      socket: {
        remoteAddress: "",
      },
      headers: {},
      auth_user: { id: "auth-user-id" },
    } as unknown as CustomRequest;

    mockRes = {
      cookie: vi.fn(),
      status: vi.fn(),
      json: vi.fn(),
      setHeader: vi.fn(),
    } as unknown as Response;

    nextFn = vi.fn();

    httpResponseFactory = {
      error: vi.fn(),
    } as unknown as Mocked<HttpResponseFactory>;
    expressAdapter = new ExpressAdapter(httpResponseFactory);
  });

  it("should call handler with correct arguments", async () => {
    mockHandler.mockResolvedValue(testHandlerResponse);
    const middleware = expressAdapter.adapt(mockHandler);
    await middleware(mockReq, mockRes, nextFn);

    expect(mockHandler).toHaveBeenCalledWith({
      body: mockReq.body,
      params: mockReq.params,
      query: mockReq.query,
      url: mockReq.url,
      method: mockReq.method,
      client_ip: "",
      cookies: {},
      accessToken: "",
      auth_user: mockReq.auth_user,
    });
  });

  it("should apply headers to res if provided", async () => {
    testHandlerResponse.headers = {
      "Content-Type": "application/json",
      test: "header",
    };

    mockHandler.mockResolvedValue(testHandlerResponse);
    const middleware = expressAdapter.adapt(mockHandler);
    await middleware(mockReq, mockRes, nextFn);

    for (const [key, value] of Object.entries(testHandlerResponse.headers)) {
      expect(mockRes.setHeader).toHaveBeenCalledWith(key, value);
    }
  });

  it("should not apply headers if none provided", async () => {
    mockHandler.mockResolvedValue(testHandlerResponse);
    const middleware = expressAdapter.adapt(mockHandler);
    await middleware(mockReq, mockRes, nextFn);

    expect(mockRes.setHeader).not.toHaveBeenCalled();
  });

  it("should apply cookies correctly if provided", async () => {
    const testCookie: ICookie = {
      httpOnly: true,
      maxAgeInMs: 0,
      name: "cookie",
      sameSite: "strict",
      secure: true,
      value: "value",
      domain: "localhost",
      path: "/",
    };

    testHandlerResponse.cookies = [testCookie];

    mockHandler.mockResolvedValue(testHandlerResponse);
    const middleware = expressAdapter.adapt(mockHandler);
    await middleware(mockReq, mockRes, nextFn);

    expect(mockRes.cookie).toHaveBeenCalledWith(
      testCookie.name,
      testCookie.value,
      {
        httpOnly: testCookie.httpOnly,
        path: testCookie.path,
        sameSite: testCookie.sameSite,
        secure: testCookie.secure,
        domain: testCookie.domain,
        maxAge: testCookie.maxAgeInMs,
      }
    );
  });

  it("should not apply cookies if none provided", async () => {
    mockHandler.mockResolvedValue(testHandlerResponse);
    const middleware = expressAdapter.adapt(mockHandler);
    await middleware(mockReq, mockRes, nextFn);

    expect(mockRes.cookie).not.toHaveBeenCalled();
  });

  it("should set authenticated user on req if handler returns it", async () => {
    testHandlerResponse.authenticatedUser = { id: "new-user" };

    mockHandler.mockResolvedValue(testHandlerResponse);
    const middleware = expressAdapter.adapt(mockHandler);
    await middleware(mockReq, mockRes, nextFn);

    expect(mockReq.auth_user).toEqual(testHandlerResponse.authenticatedUser);
  });

  it("should call res.status/json when handler is a controller", async () => {
    mockHandler.mockResolvedValue(testHandlerResponse);
    const middleware = expressAdapter.adapt(mockHandler, true);
    await middleware(mockReq, mockRes, nextFn);

    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockRes.json).toHaveBeenCalledWith({
      errors: [],
      result: null,
      success: true,
    });
  });

  it("should call next() if handler is middleware and succeeded", async () => {
    mockHandler.mockResolvedValue(testHandlerResponse);
    const middleware = expressAdapter.adapt(mockHandler);
    await middleware(mockReq, mockRes, nextFn);

    expect(nextFn).toHaveBeenCalled();
  });

  it("should send response if handler middleware failed", async () => {
    testHandlerResponse.response.success = false;
    testHandlerResponse.response.code = 400;
    testHandlerResponse.response.errors = ["error"];

    mockHandler.mockResolvedValue(testHandlerResponse);
    const middleware = expressAdapter.adapt(mockHandler);
    await middleware(mockReq, mockRes, nextFn);

    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockRes.json).toHaveBeenCalledWith({
      errors: ["error"],
      result: null,
      success: false,
    });
  });

  it("should parse cookies from req.headers.cookie", async () => {
    mockReq.headers.cookie = "c1=v1; c2=v2";

    mockHandler.mockResolvedValue(testHandlerResponse);
    const middleware = expressAdapter.adapt(mockHandler);
    await middleware(mockReq, mockRes, nextFn);

    expect(mockHandler).toHaveBeenCalledWith(
      expect.objectContaining({
        cookies: { c1: "v1", c2: "v2" },
      })
    );
  });

  it("should set access token if authorization header is provided", async () => {
    mockReq.headers.authorization = "Bearer token123";

    mockHandler.mockResolvedValue(testHandlerResponse);
    const middleware = expressAdapter.adapt(mockHandler);
    await middleware(mockReq, mockRes, nextFn);

    expect(mockHandler).toHaveBeenCalledWith(
      expect.objectContaining({
        accessToken: "token123",
      })
    );
  });

  it("should handle AppException correctly", async () => {
    const httpResponse: IHttpResponse<null> = {
      code: 400,
      errors: ["error"],
      result: null,
      success: false,
    };

    httpResponseFactory.error.mockReturnValue(httpResponse);

    mockHandler.mockImplementation(() => {
      throw new AppException(400, ["error"], "ExpressAdapter");
    });

    const middleware = expressAdapter.adapt(mockHandler);
    await middleware(mockReq, mockRes, nextFn);

    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockRes.json).toHaveBeenCalledWith({
      errors: ["error"],
      result: null,
      success: false,
    });
  });

  it("should handle generic errors correctly", async () => {
    const httpResponse: IHttpResponse<null> = {
      code: 500,
      errors: ["Something went wrong. Please try again later."],
      result: null,
      success: false,
    };

    httpResponseFactory.error.mockReturnValue(httpResponse);

    mockHandler.mockImplementation(() => {
      throw new Error("boom");
    });

    const middleware = expressAdapter.adapt(mockHandler);
    await middleware(mockReq, mockRes, nextFn);

    expect(mockRes.status).toHaveBeenCalledWith(500);
    expect(mockRes.json).toHaveBeenCalledWith({
      errors: httpResponse.errors,
      result: null,
      success: false,
    });
  });
});
