interface ServerResponseDto<TResult> {
  success: boolean;
  errors: string[];
  result: TResult;
}

export default ServerResponseDto;
