import { Request, Response } from "express";
import { IHttpRequest, IHttpResponse } from "./ExpressAdapter.js";

abstract class Adapter {
  abstract adapt: (
    controller: (httpRequest: IHttpRequest) => Promise<IHttpResponse<any>>
  ) => (req: Request, res: Response) => Promise<void>;
}

export default Adapter;
