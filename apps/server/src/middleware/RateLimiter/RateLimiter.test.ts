import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  Mocked,
  vi,
} from "vitest";
import {
  IHttpRequest,
  IMiddlewareResponse,
} from "../../interfaces/adapter/index.js";
import RateLimiter from "./RateLimiter.js";
import { DateUtil } from "@kanban/utils";

describe("RateLimiter.ts", () => {
  let httpReqMock: IHttpRequest = {
    body: {},
    client_ip: "ip",
    method: "POST",
    params: {},
    query: {},
    url: "/url",
  };

  let dateUtilMock: Mocked<DateUtil>;

  let rateLimiter: RateLimiter;

  const now = 100000;

  beforeEach(() => {
    httpReqMock = {
      body: {},
      client_ip: "ip",
      method: "POST",
      params: {},
      query: {},
      url: "/url",
    };

    dateUtilMock = {
      now: vi.fn().mockReturnValue(now),
    } as unknown as Mocked<DateUtil>;

    rateLimiter = new RateLimiter(dateUtilMock);
  });

  it("should handle a set number of keys max", async () => {
    rateLimiter.setMaxLimitedIps(2);

    for (let i = 0; i < 3; i++) {
      dateUtilMock.now.mockReturnValue(i);

      httpReqMock.client_ip = i.toString();

      const middleware = rateLimiter.limit({
        windowMs: 1000,
        maxRequests: 100,
      });

      await middleware(httpReqMock);
    }

    expect(rateLimiter.getLimitedIpsSize()).toBe(2);
  });

  it("should return apropriate response if requests limit is reached and still within windowMs", async () => {
    const middleware = rateLimiter.limit({ maxRequests: 2, windowMs: 33000 });

    for (let i = 0; i < 2; i++) {
      await middleware(httpReqMock);
    }

    const result = await middleware(httpReqMock);

    const responseMock: IMiddlewareResponse = {
      success: false,
      headers: {
        "X-RateLimit-Limit": "2",
        "X-RateLimit-Remaining": "0",
        "X-RateLimit-Reset": "33",
      },
      errorCode: 429,
      errors: ["Too many requests. Try again in 33 seconds."],
    };

    expect(result).toEqual(responseMock);
  });

  it("should allow request if windowMs is exceded", async () => {
    const middleware = rateLimiter.limit({ maxRequests: 1, windowMs: 3000 });

    await middleware(httpReqMock);

    const notAllowedResponseMock: IMiddlewareResponse = {
      success: false,
      headers: {
        "X-RateLimit-Limit": "1",
        "X-RateLimit-Remaining": "0",
        "X-RateLimit-Reset": "3",
      },
      errorCode: 429,
      errors: ["Too many requests. Try again in 3 seconds."],
    };

    const notAllowedRes = await middleware(httpReqMock);

    expect(notAllowedRes).toEqual(notAllowedResponseMock);

    const allowedResponseMock: IMiddlewareResponse = {
      success: true,
      headers: {
        "X-RateLimit-Limit": "1",
        "X-RateLimit-Remaining": "0",
        "X-RateLimit-Reset": "3",
      },
      errorCode: 0,
      errors: [],
    };

    dateUtilMock.now.mockReturnValue(now + 4000);

    const allowedRes = await middleware(httpReqMock);

    expect(allowedRes).toEqual(allowedResponseMock);
  });
});
