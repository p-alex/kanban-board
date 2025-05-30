import { IHttpRequest, IHttpResponse } from "../adapter/ExpressAdapter.js";

export interface IController {
  handle: (httpReq: IHttpRequest) => Promise<IHttpResponse<any>>;
}
