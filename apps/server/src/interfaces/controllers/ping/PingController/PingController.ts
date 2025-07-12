import HttpResponseFactory from "../../../../HttpResponseFactory/HttpResponseFactory.js";
import { IHandlerResponse, IHttpRequest } from "../../../adapter/index.js";

class PingController {
  constructor(private readonly _httpResponseFactory: HttpResponseFactory) {}

  handle = (_: IHttpRequest): Promise<IHandlerResponse<"pong">> => {
    return Promise.resolve({
      response: this._httpResponseFactory.success(200, "pong"),
    });
  };
}

export default PingController;
