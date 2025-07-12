import BestHttpInstance from "./BestHttpInstance";
import BestHttpRequestInterceptorManager from "./BestHttpRequestInterceptorManager";
import BestHttpResponseInterceptorManager from "./BestHttpResponseInterceptorManager";
import BestHttpFetchConfigAdapter from "./FetchConfigAdapter";
import BodyHandler from "./BodyHandler/BodyHandler";

export interface IBestHttpConfig<TBody = any> {
  url: string;
  method: "get" | "post" | "put" | "patch" | "delete";
  body: TBody;
  headers: {
    "Content-Type": string;
    Authorization?: string;
  };
  withCredentials: boolean;
  wasSent?: boolean;
}

export interface IBestHttpResponse<TData = any> {
  status: number;
  success: boolean;
  data: TData;
  errors: string[];
}

class BestHttp {
  private _defaultConfig: IBestHttpConfig;

  constructor(private readonly _bodyHandler: BodyHandler) {
    this._defaultConfig = {
      url: "/",
      method: "get",
      body: undefined,
      headers: {
        "Content-Type": "application/json",
        Authorization: undefined,
      },
      withCredentials: false,
    };
  }

  getDefaultConfig = () => {
    return this._defaultConfig;
  };

  create = (
    baseUrl?: string,
    instanceConfig?: Pick<
      Partial<IBestHttpConfig>,
      "headers" | "withCredentials"
    >
  ): BestHttpInstance => {
    const config = { ...this._defaultConfig, ...(instanceConfig ?? {}) };

    const newInstance = new BestHttpInstance(
      baseUrl || "",
      config,
      new BestHttpRequestInterceptorManager(),
      new BestHttpResponseInterceptorManager(),
      new BestHttpFetchConfigAdapter(this._bodyHandler)
    );

    return newInstance;
  };
}

export default BestHttp;
