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
import { ServerResponseDto } from "@kanban/dtos/ServerResponseDto";
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
      cookie: "",
      headers: {},
      user: undefined,
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
      client_ip: mockReq.ip || mockReq.socket.remoteAddress || "",
      cookies: {},
      accessToken: mockReq.headers["authorization"]
        ? mockReq.headers["authorization"].split(" ")[1]
        : "",
      user: mockReq.user,
    });
  });

  it("should apply headers to res if are provided", async () => {
    testHandlerResponse.headers = {
      "Content-Type": "application/json",
      test: "header",
      wow: "wow",
    };

    mockHandler.mockResolvedValue(testHandlerResponse);
    const middleware = expressAdapter.adapt(mockHandler);
    await middleware(mockReq, mockRes, nextFn);

    for (let key in testHandlerResponse.headers) {
      expect(mockRes.setHeader).toHaveBeenCalledWith(
        key,
        testHandlerResponse.headers[key]
      );
    }
  });

  it("should not apply headers to res if they are not provided", async () => {
    mockHandler.mockResolvedValue(testHandlerResponse);
    const middleware = expressAdapter.adapt(mockHandler);
    await middleware(mockReq, mockRes, nextFn);

    expect(mockRes.setHeader).not.toHaveBeenCalled();
  });

  it("should apply cookies correctly if there are any", async () => {
    const testCookie1: ICookie = {
      httpOnly: true,
      maxAgeInMs: 0,
      name: "cookie",
      sameSite: "strict",
      secure: true,
      value: "value",
      domain: "localhost",
      path: "/",
    };

    const testCookie2: ICookie = {
      ...testCookie1,
      name: "cookie2",
      value: "value2",
    };

    testHandlerResponse.cookies = [testCookie1, testCookie2];

    mockHandler.mockResolvedValue(testHandlerResponse);
    const middleware = expressAdapter.adapt(mockHandler);
    await middleware(mockReq, mockRes, nextFn);

    for (let i = 0; i < testHandlerResponse.cookies.length; i++) {
      const cookie = testHandlerResponse.cookies[i];

      expect(mockRes.cookie).toHaveBeenCalledWith(cookie.name, cookie.value, {
        httpOnly: cookie.httpOnly,
        path: cookie.path,
        sameSite: cookie.sameSite,
        secure: cookie.secure,
        domain: cookie.domain,
        maxAge: cookie.maxAgeInMs,
      });
    }
  });

  it("should not apply cookies if none are provided by the handler", async () => {
    mockHandler.mockResolvedValue(testHandlerResponse);
    const middleware = expressAdapter.adapt(mockHandler);
    await middleware(mockReq, mockRes, nextFn);

    expect(mockRes.cookie).not.toHaveBeenCalled();
  });

  it("should apply authenticated user to req object if there is one", async () => {
    testHandlerResponse.authenticatedUser = {
      id: "id",
    };

    mockHandler.mockResolvedValue(testHandlerResponse);
    const middleware = expressAdapter.adapt(mockHandler);
    await middleware(mockReq, mockRes, nextFn);

    expect(mockReq.user).toEqual(testHandlerResponse.authenticatedUser);
  });

  it("should call res.status and res.json with correct values when handler is a controller", async () => {
    mockHandler.mockResolvedValue(testHandlerResponse);
    const middleware = expressAdapter.adapt(mockHandler, true);
    await middleware(mockReq, mockRes, nextFn);

    expect(mockRes.status).toHaveBeenCalledWith(
      testHandlerResponse.response.code
    );

    const serverResponseDto: ServerResponseDto<any> = {
      errors: testHandlerResponse.response.errors,
      result: testHandlerResponse.response.result,
    };

    expect(mockRes.json).toHaveBeenCalledWith(serverResponseDto);
  });

  it("should call 'next' function if handler is a middleware and it succeeded", async () => {
    mockHandler.mockResolvedValue(testHandlerResponse);
    const middleware = expressAdapter.adapt(mockHandler);
    await middleware(mockReq, mockRes, nextFn);

    expect(nextFn).toHaveBeenCalled();
  });

  it("should call res.status and res.json with correct values when handler is a middleware and it failed", async () => {
    testHandlerResponse.response.code = 400;
    testHandlerResponse.response.success = false;
    testHandlerResponse.response.errors = ["some error"];

    const httpResponse: IHttpResponse<null> = {
      code: 500,
      errors: ["server error"],
      result: null,
      success: false,
    };

    httpResponseFactory.error.mockReturnValue(httpResponse);

    mockHandler.mockResolvedValue(testHandlerResponse);
    const middleware = expressAdapter.adapt(mockHandler);
    await middleware(mockReq, mockRes, nextFn);

    expect(mockRes.status).toHaveBeenCalledWith(
      testHandlerResponse.response.code
    );

    const serverResponseDto: ServerResponseDto<any> = {
      errors: testHandlerResponse.response.errors,
      result: testHandlerResponse.response.result,
    };

    expect(mockRes.json).toHaveBeenCalledWith(serverResponseDto);
  });

  it("req.ip should be set as default as client ip if it is defined", async () => {
    const modifiedMockReq = { ...mockReq, ip: "ip" } as CustomRequest;

    mockHandler.mockResolvedValue(testHandlerResponse);
    const middleware = expressAdapter.adapt(mockHandler);
    await middleware(modifiedMockReq, mockRes, nextFn);

    expect(mockHandler).toHaveBeenCalledWith({
      body: mockReq.body,
      params: mockReq.params,
      query: mockReq.query,
      url: mockReq.url,
      method: mockReq.method,
      client_ip: "ip",
      cookies: {},
      accessToken: "",
      user: mockReq.user,
    });
  });

  it("req.socket.remoteAddress should be set as default client ip if it is defined and req.ip is not", async () => {
    const modifiedMockReq = {
      ...mockReq,
      socket: { remoteAddress: "remoteAddress" },
    } as CustomRequest;

    mockHandler.mockResolvedValue(testHandlerResponse);
    const middleware = expressAdapter.adapt(mockHandler);
    await middleware(modifiedMockReq, mockRes, nextFn);

    expect(mockHandler).toHaveBeenCalledWith({
      body: mockReq.body,
      params: mockReq.params,
      query: mockReq.query,
      url: mockReq.url,
      method: mockReq.method,
      client_ip: "remoteAddress",
      cookies: {},
      accessToken: "",
      user: mockReq.user,
    });
  });

  it("client_ip should be set to empty string if both req.ip and req.socket.remoteAddress are not provided", async () => {
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
      user: mockReq.user,
    });
  });

  it("should set access token if authorization header is provided", async () => {
    const modifiedMockReq = {
      ...mockReq,
      headers: { authorization: "Bearer accessToken" },
    } as CustomRequest;

    mockHandler.mockResolvedValue(testHandlerResponse);
    const middleware = expressAdapter.adapt(mockHandler);
    await middleware(modifiedMockReq, mockRes, nextFn);

    expect(mockHandler).toHaveBeenCalledWith({
      body: mockReq.body,
      params: mockReq.params,
      query: mockReq.query,
      url: mockReq.url,
      method: mockReq.method,
      client_ip: "",
      cookies: {},
      accessToken: "accessToken",
      user: mockReq.user,
    });
  });

  it("should parse cookies from req object properly", async () => {
    const modifiedMockReq = {
      ...mockReq,
      headers: {
        cookie: "cookie1=value1; cookie2=value2",
      },
    } as CustomRequest;

    mockHandler.mockResolvedValue(testHandlerResponse);
    const middleware = expressAdapter.adapt(mockHandler);
    await middleware(modifiedMockReq, mockRes, nextFn);

    expect(mockHandler).toHaveBeenCalledWith({
      body: mockReq.body,
      params: mockReq.params,
      query: mockReq.query,
      url: mockReq.url,
      method: mockReq.method,
      client_ip: "",
      cookies: { cookie1: "value1", cookie2: "value2" },
      accessToken: "",
      user: mockReq.user,
    });
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
      throw new AppException(400, ["error"]);
    });
    const middleware = expressAdapter.adapt(mockHandler);
    await middleware(mockReq, mockRes, nextFn);

    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockRes.json).toHaveBeenCalledWith({
      errors: ["error"],
      result: null,
    });
  });

  it("should handle any error correctly", async () => {
    const httpResponse: IHttpResponse<null> = {
      code: 400,
      errors: ["error"],
      result: null,
      success: false,
    };

    httpResponseFactory.error.mockReturnValue(httpResponse);

    mockHandler.mockImplementation(() => {
      throw new Error("error");
    });
    const middleware = expressAdapter.adapt(mockHandler);
    await middleware(mockReq, mockRes, nextFn);

    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockRes.json).toHaveBeenCalledWith({
      errors: ["error"],
      result: null,
    });
  });
});
