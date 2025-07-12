import { IBestHttpConfig } from "./BestHttp";
import { IBestHttpResponse } from "./BestHttp";

export type ResponseInterceptorSuccessCb = <TData>(
  result: IBestHttpResponse
) => IBestHttpResponse<TData> | Promise<IBestHttpResponse<TData>>;

export type ResponseInterceptorErrorCb = <TData>(
  response: IBestHttpResponse,
  config: IBestHttpConfig
) => IBestHttpResponse<TData> | Promise<IBestHttpResponse<TData>>;

interface ResponseInterceptor {
  name: string;
  run: <TData>(
    result: IBestHttpResponse,
    config: IBestHttpConfig
  ) => Promise<IBestHttpResponse<TData>>;
  eject: () => void;
}

class BestHttpResponseInterceptorManager {
  private _responseInterceptors: ResponseInterceptor[] = [];

  addInterceptor = (
    name: string,
    successCb: ResponseInterceptorSuccessCb,
    errorCb: ResponseInterceptorErrorCb
  ) => {
    const interceptor = this._createInterceptor(name, successCb, errorCb);
    this._responseInterceptors.push(interceptor);
    return interceptor;
  };

  runAll = async <TData>(
    result: IBestHttpResponse<TData>,
    config: IBestHttpConfig
  ) => {
    let newResult: IBestHttpResponse<TData> = { ...result };

    for (let i = 0; i < this._responseInterceptors.length; i++) {
      const interceptor = this._responseInterceptors[i];
      const modifiedResponse = await interceptor.run<TData>(newResult, config);
      newResult = modifiedResponse;
    }

    return newResult;
  };

  _createInterceptor = (
    name: string,
    successCb: ResponseInterceptorSuccessCb,
    errorCb: ResponseInterceptorErrorCb
  ): ResponseInterceptor => {
    return {
      name,
      run: async <TData>(
        response: IBestHttpResponse<TData>,
        config: IBestHttpConfig
      ) => {
        if (response.success) {
          return await successCb(response);
        } else {
          return await errorCb(response, config);
        }
      },
      eject: () => {
        this._ejectInterceptor(name);
      },
    };
  };

  _ejectInterceptor = (name: string) => {
    this._responseInterceptors = this._responseInterceptors.filter(
      (interceptor) => interceptor.name !== name
    );
  };
}

export default BestHttpResponseInterceptorManager;
