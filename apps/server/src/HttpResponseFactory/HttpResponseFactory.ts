import { IHttpResponse } from "../interfaces/adapter/index.js";

class HttpResponseFactory {
  constructor() {}

  success = <TResult>(
    code: number,
    result: TResult
  ): IHttpResponse<TResult> => {
    return {
      success: true,
      code,
      errors: [],
      result,
    };
  };

  error = (code: number, errors: string[]): IHttpResponse<null> => {
    return {
      success: false,
      code,
      errors,
      result: null,
    };
  };
}

export default HttpResponseFactory;
