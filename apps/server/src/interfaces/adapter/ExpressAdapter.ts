import { Request, Response } from "express";
import Adapter from "./Adapter.js";

export interface IHttpRequest<TBody = any, TParams = any, TQuery = any> {
  body: TBody;
  params: TParams;
  query: TQuery;
}

export interface IHttpResponse<TResult> {
  code: number;
  success: boolean;
  result: TResult;
  errors: string[];
}

class ExpressAdapter implements Adapter {
  adapt(
    controller: (httpRequest: IHttpRequest) => Promise<IHttpResponse<any>>
  ) {
    return async (req: Request, res: Response) => {
      try {
        const httpRequest: IHttpRequest = {
          body: req.body,
          params: req.params,
          query: req.query,
        };

        const response = await controller(httpRequest);

        res.json(response);
      } catch (error: any) {
        console.error(error.message);

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
