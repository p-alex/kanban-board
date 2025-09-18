import BestHttpResponseException from "../utils/BestHttp/exceptions/BestHttpResponseException.js";

function extractApiErrorMessage({
  error,
  defaultErrorMessage,
}: {
  error: unknown;
  defaultErrorMessage: string;
}) {
  if (
    error instanceof BestHttpResponseException &&
    error.data?.errors?.length
  ) {
    const message = error.data.errors[0];
    return message;
  }
  return defaultErrorMessage;
}

export type ExtractApiErrorMessage = typeof extractApiErrorMessage;

export default extractApiErrorMessage;
