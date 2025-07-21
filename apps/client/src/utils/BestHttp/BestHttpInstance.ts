import { IBestHttpConfig } from "./BestHttp";
import BestHttpResponseException from "./exceptions/BestHttpResponseException";
import BestHttpRequestInterceptorManager, {
  RequestInterceptorWorkFn,
} from "./BestHttpRequestInterceptorManager";
import BestHttpResponseInterceptorManager, {
  ResponseInterceptorErrorCb,
  ResponseInterceptorSuccessCb,
} from "./BestHttpResponseInterceptorManager";
import BestHttpFetchConfigAdapter from "./FetchConfigAdapter";

export interface IBestHttpResponse<TData> {
  status: number;
  success: boolean;
  data: TData;
  errors: string[];
}

class BestHttpInstance {
  constructor(
    private readonly _baseUrl: string,
    private readonly _defaultConfig: IBestHttpConfig,
    private readonly _requestInterceptorManager: BestHttpRequestInterceptorManager,
    private readonly _responseInterceptorManager: BestHttpResponseInterceptorManager,
    private readonly _fetchConfigAdapter: BestHttpFetchConfigAdapter
  ) {}

  send = async <TData, TBody>(
    url: string,
    config?: Partial<IBestHttpConfig<TBody>>
  ): Promise<IBestHttpResponse<TData | null>> => {
    const readyUrl = this._baseUrl + url;

    const readyConfig = {
      ...this._defaultConfig,
      ...(config || {}),
    };

    readyConfig.url = url;

    const modifiedConfig = this._requestInterceptorManager.runAll(readyConfig);

    const response = await fetch(
      readyUrl,
      this._fetchConfigAdapter.adapt(modifiedConfig)
    );

    const data = await this._handleResponseParsing<TData>(
      response,
      response.headers.get("Content-Type") || ""
    );

    const result = {
      status: response.status,
      success: response.ok,
      errors: [],
      data,
    };

    const modifiedResult = await this._responseInterceptorManager.runAll<TData>(
      result,
      modifiedConfig
    );

    if (!modifiedResult.success) {
      throw new BestHttpResponseException(
        response.status,
        [response.statusText],
        modifiedResult.data
      );
    }

    return modifiedResult;
  };

  addRequestInterceptor = (name: string, workFn: RequestInterceptorWorkFn) => {
    return this._requestInterceptorManager.addInterceptor(name, workFn);
  };

  addResponseInterceptor = (
    name: string,
    successCb: ResponseInterceptorSuccessCb,
    errorCb: ResponseInterceptorErrorCb
  ) => {
    return this._responseInterceptorManager.addInterceptor(
      name,
      successCb,
      errorCb
    );
  };

  private _handleResponseParsing = async <TResult>(
    response: Response,
    contentType: string
  ): Promise<TResult> => {
    if (contentType.includes("application/json")) {
      return (await response.json()) as TResult;
    }

    if (contentType.includes("text/")) {
      return (await response.text()) as TResult;
    }

    if (contentType.includes("application/octet-stream")) {
      return (await response.arrayBuffer()) as TResult;
    }

    return (await response.blob()) as TResult;
  };
}

export default BestHttpInstance;
