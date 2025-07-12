interface ServerResponseDto<TResult> {
  errors: string[];
  result: TResult;
}

export default ServerResponseDto;
