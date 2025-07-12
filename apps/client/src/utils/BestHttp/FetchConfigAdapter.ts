import { IBestHttpConfig } from "./BestHttp.js";
import BodyHandler from "./BodyHandler/BodyHandler.js";

class BestHttpFetchConfigAdapter {
  constructor(private readonly _bodyHandler: BodyHandler) {}

  adapt(bestHttpConfig: IBestHttpConfig): Partial<RequestInit> {
    return {
      method: bestHttpConfig.method,
      body:
        bestHttpConfig.method === "get"
          ? undefined
          : this._bodyHandler.handle(
              bestHttpConfig.headers["Content-Type"],
              bestHttpConfig.body
            ),
      headers: { ...bestHttpConfig.headers },
      credentials: bestHttpConfig.withCredentials ? "include" : "omit",
    };
  }
}

export default BestHttpFetchConfigAdapter;
