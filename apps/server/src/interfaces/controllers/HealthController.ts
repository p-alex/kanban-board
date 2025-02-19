import { IHttpRequest, IHttpResponse } from "../adapter/ExpressAdapter.js";

class HealthController {
  async ping(_: IHttpRequest): Promise<IHttpResponse<"pong">> {
    return Promise.resolve({
      code: 200,
      result: "pong",
      success: true,
      errors: [],
    });
  }
}

export default HealthController;
