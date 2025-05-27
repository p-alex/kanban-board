export interface Response<TResult = any> {
  code: number;
  success: boolean;
  errors: string[];
  result: TResult;
}
