interface ServerResponseDto<TResult> {
  success: boolean;
  code: number;
  errors: string[];
  result: TResult;
}

export default ServerResponseDto;
