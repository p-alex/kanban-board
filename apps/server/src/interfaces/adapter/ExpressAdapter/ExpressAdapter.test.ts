import { describe, it, vi, expect, Mocked, beforeEach } from "vitest";
import { Request, Response } from "express";
import ExpressAdapter from "./ExpressAdapter.js";
import { IHttpRequest, IHttpResponse } from "../index.js";
import AppException from "../../../exceptions/AppException.js";

describe("ExpressAdapter.ts", () => {
  let reqMock: Mocked<Request>;
  let resMock: Mocked<Response>;

  let expressAdapter: ExpressAdapter;

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
    } as unknown as Mocked<Response>;

    expressAdapter = new ExpressAdapter();
  });

  it("should apply client_ip to httpRequest correctly", async () => {
    const controller = vi.fn();

    const adapterHandler = expressAdapter.adapt(controller);

    await adapterHandler(reqMock, resMock);

    const httpReqMock: IHttpRequest = {
      body: reqMock.body,
      params: reqMock.params,
      query: reqMock.query,
      client_ip: reqMock.ip!,
      method: reqMock.method,
      url: reqMock.url,
    };

    expect(controller).toHaveBeenCalledWith(httpReqMock);

    reqMock = { ...reqMock, ip: "" };

    await adapterHandler(reqMock, resMock);

    expect(controller).toHaveBeenCalledWith({
      ...httpReqMock,
      client_ip: reqMock.socket.remoteAddress,
    });

    reqMock = {
      ...reqMock,
      ip: "",
      socket: { remoteAddress: "" },
    } as Mocked<Request>;

    await adapterHandler(reqMock, resMock);

    expect(controller).toHaveBeenCalledWith({
      ...httpReqMock,
      client_ip: "",
    });
  });

  it("should correctly adapt controller", async () => {
    const controllerResponseMock: IHttpResponse<null> = {
      code: 200,
      errors: [],
      result: null,
      success: true,
    };
    const controller = vi.fn().mockResolvedValue(controllerResponseMock);

    const adapterHandler = expressAdapter.adapt(controller);

    await adapterHandler(reqMock, resMock);

    expect(resMock.json).toHaveBeenCalledWith(controllerResponseMock);
  });

  it("should handle AppExceptions correctly", async () => {
    const controller = vi.fn().mockImplementation(() => {
      throw new AppException(401, "Unauthorized");
    });

    const adapterHandler = expressAdapter.adapt(controller);

    try {
      await adapterHandler(reqMock, resMock);
    } catch (error) {
      const httpResponseMock: IHttpResponse<null> = {
        code: 401,
        errors: ["Unauthorized"],
        result: null,
        success: false,
      };
      expect(resMock.status).toHaveBeenCalledWith(401);
      expect(resMock.json).toHaveBeenCalledWith(httpResponseMock);
    }
  });

  it("should handle other exceptions correctly", async () => {
    const controller = vi.fn().mockImplementation(() => {
      throw new Error("Other exception");
    });

    const adapterHandler = expressAdapter.adapt(controller);

    try {
      await adapterHandler(reqMock, resMock);
    } catch (error) {
      const httpResponseMock: IHttpResponse<null> = {
        code: 500,
        errors: ["Something went wrong. Please try again later."],
        result: null,
        success: false,
      };
      expect(resMock.status).toHaveBeenCalledWith(500);
      expect(resMock.json).toHaveBeenCalledWith(httpResponseMock);
    }
  });
});
