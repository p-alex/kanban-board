import { IHttpRequest, IHttpResponse } from "../adapter/index.js";

export interface IController {
  handle: (httpReq: IHttpRequest) => Promise<IHttpResponse<any>>;
}
