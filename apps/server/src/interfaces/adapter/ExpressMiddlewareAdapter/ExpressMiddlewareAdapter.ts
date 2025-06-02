import { NextFunction, Request, Response } from "express";
import AppException from "../../../exceptions/AppException.js";
import { IHttpRequest, IHttpResponse, IMiddlewareResponse } from "../index.js";

class ExpressMiddlewareAdapter {
  adapt(
    middleware: (httpRequest: IHttpRequest) => Promise<IMiddlewareResponse>
  ) {
    return async (req: Request, res: Response, next: NextFunction) => {
      try {
        const httpRequest: IHttpRequest = {
          body: req.body,
          params: req.params,
          query: req.query,
          client_ip: req.ip || req.socket.remoteAddress || "",
          method: req.method,
          url: req.url,
        };

        const { headers, success, errors, errorCode } = await middleware(
          httpRequest
        );

        Object.keys(headers).forEach((key) => {
          res.setHeader(key, headers[key as keyof typeof headers]);
        });

        if (!success && errors) {
          throw new AppException(errorCode, errors);
        }

        next();
      } catch (error: any) {
        console.error(error);

        if (error instanceof AppException) {
          res.status(error.code);

          res.json({
            code: error.code,
            result: null,
            errors: error.errors,
            success: false,
          } as IHttpResponse<null>);

          return;
        }

        res.status(500);

        res.json({
          code: 500,
          result: null,
          errors: ["Something went wrong. Please try again later."],
          success: false,
        } as IHttpResponse<null>);
      }
    };
  }
}

export default ExpressMiddlewareAdapter;
