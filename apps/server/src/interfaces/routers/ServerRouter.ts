import { Router } from "express";
import { IHttpRequest, IHttpResponse } from "../adapter/ExpressAdapter.js";
import Adapter from "../adapter/Adapter.js";

class ServerRouter {
  private _router: Router;

  constructor(private readonly _adapter: Adapter) {
    this._router = Router();
  }

  get = async (
    url: string,
    controller: (httpRequest: IHttpRequest) => Promise<IHttpResponse<any>>
  ) => {
    this._router.get(url, this._adapter.adapt(controller));
  };

  getRouter = () => {
    return this._router;
  };
}

export default ServerRouter;
