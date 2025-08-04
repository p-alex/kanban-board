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
