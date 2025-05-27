import { Response } from "../../api/application/usecases/index.js";
import HttpError from "./HttpError.js";

interface Options {
  credentials?: "include" | "omit";
  headers?: {
    "Content-Type"?: string;
    Authorization?: string;
  };
}

interface IHttpClient {
  query: <TResult>(
    url: string,
    options?: Options
  ) => Promise<Response<TResult>>;
  mutate: <TBody extends object, TResult>(
    url: string,
    method: "POST" | "PUT" | "PATCH" | "DELETE",
    body: TBody,
    options?: Options
  ) => Promise<Response<TResult>>;
}

class HttpClient implements IHttpClient {
  private readonly _baseUrl: string;
  private readonly _defaultOptions: Options;

  constructor(
    _baseUrl: string,
    _defaultOptions: Options = {
      credentials: "omit",
      headers: { "Content-Type": "application/json", Authorization: "" },
    }
  ) {
    this._baseUrl = _baseUrl;
    this._defaultOptions = _defaultOptions;
  }

  private _getOptionsObject = (options?: Options): Options => {
    return {
      credentials:
        options && options.credentials
          ? options.credentials
          : this._defaultOptions.credentials,
      headers:
        options && options.headers
          ? options.headers
          : this._defaultOptions.headers,
    };
  };

  query = async <TResult>(url: string, options?: Options) => {
    const response = await fetch(
      this._baseUrl + url,
      this._getOptionsObject(options)
    );
    if (!response.ok)
      throw new HttpError(response.statusText, response.status, url, "GET");
    const result = (await response.json()) as TResult;
    return result;
  };

  mutate = async <TBody extends object, TResult>(
    url: string,
    method: "POST" | "PATCH" | "DELETE" | "PUT",
    body?: TBody,
    options?: Options
  ) => {
    const response = await fetch(this._baseUrl + url, {
      method,
      body: JSON.stringify(body),
      ...this._getOptionsObject(options),
    });

    const result = (await response.json()) as Response<TResult>;

    if (!response.ok)
      throw new HttpError(result.errors[0], response.status, url, method);

    return result;
  };
}

export default HttpClient;
