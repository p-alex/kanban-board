interface IHttpError {
  message: string;
  code: number;
  url: string;
  method: HttpMethod;
}

type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

class HttpError implements IHttpError {
  constructor(
    public readonly message: string,
    public readonly code: number,
    public readonly url: string,
    public readonly method: HttpMethod,
  ) {
    this.message = message;
  }
}

export default HttpError;
