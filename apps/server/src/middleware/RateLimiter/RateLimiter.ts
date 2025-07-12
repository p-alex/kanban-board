import { DateUtil } from "@kanban/utils";
import {
  IHttpRequest,
  IHandlerResponse,
} from "../../interfaces/adapter/index.js";
import HttpResponseFactory from "../../HttpResponseFactory/HttpResponseFactory.js";

interface RateLimitParams {
  windowMs: number;
  maxRequests: number;
}

interface LimitedIp {
  windowMs: number;
  maxRequests: number;
  requests: number;
  firstRequestTime: number;
  expireTime: number;
}

class RateLimiter {
  private _limitedIps: Map<string, LimitedIp>;
  private _maxKeys: number;

  constructor(
    private readonly _date: DateUtil,
    private readonly _httpResponseFactory: HttpResponseFactory
  ) {
    this._limitedIps = new Map<string, LimitedIp>();
    this._maxKeys = 100;
  }

  limit = (params: RateLimitParams) => {
    return async (httpReq: IHttpRequest): Promise<IHandlerResponse<null>> => {
      const key = this._getKey(httpReq);

      const now = this._date.now();

      const hasKey = this._limitedIps.has(key);

      if (!hasKey) {
        this._limitedIps.set(key, {
          windowMs: params.windowMs,
          maxRequests: params.maxRequests,
          requests: 0,
          firstRequestTime: now,
          expireTime: now + params.windowMs,
        });
      }

      if (this._limitedIps.size > this._maxKeys) {
        this._deleteOldestLimitedIp();
      }

      const limitedIp = this._limitedIps.get(key) as LimitedIp;

      limitedIp.requests += 1;

      if (
        limitedIp.requests > limitedIp.maxRequests &&
        now < limitedIp.expireTime
      ) {
        return Promise.resolve({
          response: this._httpResponseFactory.error(429, [
            this._getTooManyRequestsErrorMessage(limitedIp),
          ]),
          headers: this._getHeaders(limitedIp),
        });
      }

      if (now >= limitedIp.expireTime) {
        limitedIp.requests = 1;
        limitedIp.expireTime = now + limitedIp.windowMs;
      }

      this._limitedIps.set(key, limitedIp);

      return Promise.resolve({
        response: this._httpResponseFactory.success(200, null),
        headers: this._getHeaders(limitedIp),
      });
    };
  };

  setMaxLimitedIps = (max: number) => {
    this._maxKeys = max;
  };

  getLimitedIpsSize = () => {
    return this._limitedIps.size;
  };

  private _getTimeUntilReset = (limitedIp: LimitedIp) => {
    const now = Math.floor(this._date.now() / 1000);
    const resetSeconds = Math.floor(limitedIp.expireTime / 1000 - now);
    return resetSeconds;
  };

  private _getTooManyRequestsErrorMessage = (limitedIp: LimitedIp) => {
    return `Too many requests. Try again in ${this._getTimeUntilReset(
      limitedIp
    ).toString()} seconds.`;
  };

  private _getHeaders = (limitedIp: LimitedIp) => {
    const now = this._date.now();
    const resetSeconds = Math.floor(limitedIp.expireTime / 1000 - now / 1000);
    const headers = {
      "X-RateLimit-Limit": limitedIp.maxRequests.toString(),
      "X-RateLimit-Remaining": Math.max(
        limitedIp.maxRequests - limitedIp.requests,
        0
      ).toString(),
      "X-RateLimit-Reset": resetSeconds.toString(),
    };
    return headers;
  };

  private _deleteOldestLimitedIp = () => {
    let oldestLimitedIpKey = "";
    let oldestLimitedIpTime = this._date.now();

    this._limitedIps.forEach((limitedIp, key) => {
      if (oldestLimitedIpTime > limitedIp.firstRequestTime) {
        oldestLimitedIpTime = limitedIp.firstRequestTime;
        oldestLimitedIpKey = key;
      }
    });

    this._limitedIps.delete(oldestLimitedIpKey);
  };

  private _getKey = (req: IHttpRequest) => {
    const ip = req.client_ip;
    const url = req.url.split("?")[0];
    const method = req.method;
    return ip + "|" + url + "|" + method;
  };
}

export default RateLimiter;
