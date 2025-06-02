import { IHttpRequest, IHttpResponse } from "../../adapter/index.js";

class PingController {
  async ping(_: IHttpRequest): Promise<IHttpResponse<"pong">> {
    return Promise.resolve({
      code: 200,
      result: "pong",
      success: true,
      errors: [],
    });
  }
}

export default PingController;
