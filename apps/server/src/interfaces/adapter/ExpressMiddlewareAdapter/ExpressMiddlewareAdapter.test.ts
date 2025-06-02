import { beforeEach, describe, expect, it, Mocked, vi } from "vitest";
import ExpressMiddlewareAdapter from "./ExpressMiddlewareAdapter.js";
import { IHttpRequest, IHttpResponse, IMiddlewareResponse } from "../index.js";
import { Request, Response } from "express";
import AppException from "../../../exceptions/AppException.js";

describe("ExpressMiddlewareAdapter.ts", () => {
  let reqMock: Mocked<Request>;
  let resMock: Mocked<Response>;

  let expressMiddlewareAdapter: ExpressMiddlewareAdapter;

  beforeEach(() => {
    reqMock = {
      body: {},
      params: {},
      query: {},
      ip: "ip",
      socket: {
        remoteAddress: "ip",
      },
      method: "get",
      url: "url",
    } as unknown as Mocked<Request>;

    resMock = {
      json: vi.fn(),
      status: vi.fn(),
      setHeader: vi.fn(),
    } as unknown as Mocked<Response>;

    expressMiddlewareAdapter = new ExpressMiddlewareAdapter();
  });

  it("should apply client_ip to httpRequest correctly", async () => {
    const middleware = vi.fn();

    const adapterHandler = expressMiddlewareAdapter.adapt(middleware);

    await adapterHandler(reqMock, resMock, vi.fn());

    const httpReqMock: IHttpRequest = {
      body: reqMock.body,
      params: reqMock.params,
      query: reqMock.query,
      client_ip: reqMock.ip!,
      method: reqMock.method,
      url: reqMock.url,
    };

    expect(middleware).toHaveBeenCalledWith(httpReqMock);

    reqMock = { ...reqMock, ip: "" };

    await adapterHandler(reqMock, resMock, vi.fn());

    expect(middleware).toHaveBeenCalledWith({
      ...httpReqMock,
      client_ip: reqMock.socket.remoteAddress,
    });

    reqMock = {
      ...reqMock,
      ip: "",
      socket: { remoteAddress: "" },
    } as Mocked<Request>;

    await adapterHandler(reqMock, resMock, vi.fn());

    expect(middleware).toHaveBeenCalledWith({
      ...httpReqMock,
      client_ip: "",
    });
  });

  it("should apply headers correclty", async () => {
    const mockHeaders = { Header1: "value", Header2: "value" };

    const middleware = vi.fn().mockResolvedValue({ headers: mockHeaders });

    const adapterHandler = expressMiddlewareAdapter.adapt(middleware);

    await adapterHandler(reqMock, resMock, vi.fn());

    for (let key in mockHeaders) {
      expect(resMock.setHeader).toHaveBeenCalledWith(
        key,
        mockHeaders[key as keyof typeof mockHeaders]
      );
    }

    expect(resMock.setHeader).toHaveBeenCalledTimes(2);
  });

  it("should throw AppException if middleware return unsuccessful response", async () => {
    const mockMiddlewareResponse: IMiddlewareResponse = {
      success: false,
      errorCode: 401,
      headers: {},
      errors: ["Unauthorized"],
    };
    const middleware = vi.fn().mockResolvedValue(mockMiddlewareResponse);

    const adapterHandler = expressMiddlewareAdapter.adapt(middleware);

    try {
      await adapterHandler(reqMock, resMock, vi.fn());
    } catch (error) {
      expect(error).toBeInstanceOf(AppException);
      if (error instanceof AppException) {
        expect(error.code).toBe(401);
        expect(error.errors[0]).toBe("Unauthorized");
        expect(resMock.status).toHaveBeenCalledWith(401);
        expect(resMock.json).toHaveBeenCalledWith({
          code: 401,
          result: null,
          errors: ["Unauthorized"],
          success: false,
        } as IHttpResponse<null>);
      }
    }
  });

  it("should handle any other exception correctly", async () => {
    const middleware = vi.fn(() => {
      throw new Error("error");
    });

    const adapterHandler = expressMiddlewareAdapter.adapt(middleware);

    try {
      await adapterHandler(reqMock, resMock, vi.fn());
    } catch (error: any) {
      expect(error).toBeInstanceOf(Error);
      expect(error.message).toBe(
        "Something went wrong. Please try again later."
      );
      expect(resMock.status).toHaveBeenCalledWith(500);
      expect(resMock.json).toHaveBeenCalledWith({
        code: 500,
        result: null,
        errors: ["Something went wrong. Please try again later."],
        success: false,
      } as IHttpResponse<null>);
    }
  });
});
