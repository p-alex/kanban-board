import { NextFunction, Response } from "express";
import {
  CustomRequest,
  ICookie,
  IHttpRequest,
  IHttpResponse,
  IHandlerResponse,
} from "../index.js";
import AppException from "../../../exceptions/AppException.js";
import HttpResponseFactory from "../../../HttpResponseFactory/HttpResponseFactory.js";
import { ServerResponseDto } from "@kanban/dtos/ServerResponseDto";

class ExpressAdapter {
  constructor(private readonly _httpResponseFactory: HttpResponseFactory) {}

  adapt = (
    handler: (httpReq: IHttpRequest) => Promise<IHandlerResponse<any>>,
    isController: boolean = false
  ) => {
    return async (req: CustomRequest, res: Response, next: NextFunction) => {
      try {
        const handlerRes = await handler(this._getHttpReq(req));

        this._applyHeaders(res, handlerRes.headers);
        this._applyCookies(res, handlerRes.cookies);

        if (handlerRes.authenticatedUser)
          req.user = handlerRes.authenticatedUser;

        if (!isController && handlerRes.response.success) {
          return next();
        }

        res.status(handlerRes.response.code);
        res.json(this._toServerResponseDto(handlerRes.response));
      } catch (error) {
        this._handleError(res, error);
      }
    };
  };

  private _getHttpReq = (req: CustomRequest): IHttpRequest => {
    return {
      body: req.body,
      params: req.params,
      query: req.query,
      url: req.url,
      method: req.method,
      client_ip: req.ip || req.socket.remoteAddress || "",
      cookies: this._parseCookieString(req.headers.cookie),
      accessToken: req.headers["authorization"]
        ? req.headers["authorization"].split(" ")[1]
        : "",
      user: req.user,
    };
  };

  private _parseCookieString = (cookie?: string) => {
    if (!cookie) return {};

    return cookie.split("; ").reduce((acc, curr) => {
      const [key, value] = curr.split("=");
      acc[key] = value;
      return acc;
    }, {} as { [key: string]: string });
  };

  private _applyHeaders = (res: Response, headers?: Record<string, string>) => {
    if (!headers) return;

    Object.keys(headers).forEach((key) => {
      res.setHeader(key, headers[key as keyof typeof headers]);
    });
  };

  private _applyCookies = (res: Response, cookies?: ICookie[]) => {
    if (!cookies) return;

    cookies.forEach((cookie) => {
      res.cookie(cookie.name, cookie.value, {
        httpOnly: cookie.httpOnly,
        path: cookie.path,
        sameSite: cookie.sameSite,
        secure: cookie.secure,
        domain: cookie.domain,
        maxAge: cookie.maxAgeInMs,
      });
    });
  };

  private _handleError = (res: Response, error: any): void => {
    console.error(error);

    if (error instanceof AppException) {
      const response = this._httpResponseFactory.error(
        error.code,
        error.errors
      );
      res.status(error.code);
      res.json(this._toServerResponseDto(response));
      return;
    }

    const response = this._httpResponseFactory.error(500, [
      "Something went wrong. Please try again later.",
    ]);
    res.status(response.code);
    res.json(this._toServerResponseDto(response));
  };

  private _toServerResponseDto = (
    response: IHttpResponse<any>
  ): ServerResponseDto<any> => {
    return {
      errors: response.errors,
      result: response.result,
    };
  };
}

export default ExpressAdapter;
