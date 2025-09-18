import { IBestHttpResponse } from "../../utils/BestHttp/BestHttpInstance";

export function makeMockBestHttpSendResponse<T>({
  success = true,
  status = 200,
  errors = [],
  data = null as T,
}: IBestHttpResponse<T>) {
  return {
    success,
    status,
    errors,
    data,
  };
}

export function makeSuccessBestHttpSendResponseMock<T>(
  data: T
): IBestHttpResponse<T> {
  return {
    data,
    errors: [],
    status: 200,
    success: true,
  };
}

export function makeErrorBestHttpSendResponseMock<T>(
  data: T
): IBestHttpResponse<T> {
  return { data, errors: ["request error"], status: 400, success: false };
}
