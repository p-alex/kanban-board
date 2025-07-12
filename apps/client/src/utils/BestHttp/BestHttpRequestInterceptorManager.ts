import { IBestHttpConfig } from "./BestHttp";

export type RequestInterceptorWorkFn = (
  config: IBestHttpConfig
) => IBestHttpConfig;

interface RequestInterceptor {
  name: string;
  run: (config: IBestHttpConfig) => IBestHttpConfig;
  eject: () => void;
}

class BestHttpRequestInterceptorManager {
  private _interceptors: RequestInterceptor[] = [];

  addInterceptor = (
    name: string,
    work: RequestInterceptorWorkFn
  ): RequestInterceptor => {
    const interceptor = this._createInterceptor(name, work);
    this._interceptors.push(interceptor);
    return interceptor;
  };

  runAll = (config: IBestHttpConfig) => {
    let resultConfig = { ...config };
    for (let i = 0; i < this._interceptors.length; i++) {
      const interceptor = this._interceptors[i];
      const result = interceptor.run(resultConfig);
      resultConfig = { ...resultConfig, ...result };
    }
    return resultConfig;
  };

  private _createInterceptor = (
    name: string,
    workFn: (config: IBestHttpConfig) => IBestHttpConfig
  ): RequestInterceptor => {
    return {
      name,
      run: (config) => {
        return workFn(config);
      },
      eject: () => {
        this._ejectInterceptor(name);
      },
    };
  };

  private _ejectInterceptor = (name: string) => {
    this._interceptors = this._interceptors.filter(
      (interceptor) => interceptor.name !== name
    );
  };
}

export default BestHttpRequestInterceptorManager;
