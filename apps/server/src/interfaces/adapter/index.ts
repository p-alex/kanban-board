export interface IMiddlewareResponse {
  success: boolean;
  headers: Record<string, string>;
  errorCode: number;
  errors: string[];
}

export interface IHttpRequest<TBody = any, TParams = any, TQuery = any> {
  body: TBody;
  params: TParams;
  query: TQuery;
  client_ip: string;
  method: string;
  url: string;
}

export interface IHttpResponse<TResult> {
  code: number;
  success: boolean;
  result: TResult;
  errors: string[];
}
