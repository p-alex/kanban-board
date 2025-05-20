import { Response } from "./application/usecases";

function createResponse<TResult>(data: {
  code: number;
  errors: string[];
  result: TResult;
  success: boolean;
}): Response<TResult> {
  return {
    code: data.code,
    errors: data.errors,
    result: data.result,
    success: data.success,
  };
}

export default createResponse;
