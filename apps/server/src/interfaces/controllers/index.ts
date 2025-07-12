import { IHandlerResponse, IHttpRequest } from "../adapter/index.js";

export interface IHandler {
  handle: (httpReq: IHttpRequest) => Promise<IHandlerResponse<any>>;
}
