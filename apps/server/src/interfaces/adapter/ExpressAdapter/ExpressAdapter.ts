import { Request, Response } from "express";
import AppException from "../../../exceptions/AppException.js";
import { IHttpRequest, IHttpResponse } from "../index.js";

class ExpressAdapter {
  adapt(
    controller: (httpRequest: IHttpRequest) => Promise<IHttpResponse<any>>
  ) {
    return async (req: Request, res: Response) => {
      try {
        const httpRequest: IHttpRequest = {
          body: req.body,
          params: req.params,
          query: req.query,
          client_ip: req.ip || req.socket.remoteAddress || "",
          method: req.method,
          url: req.url,
        };

        const response = await controller(httpRequest);

        res.json(response);
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

export default ExpressAdapter;
