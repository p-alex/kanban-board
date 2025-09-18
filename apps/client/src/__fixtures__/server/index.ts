import { ServerResponseDto } from "@kanban/dtos/ServerResponseDto";

export function makeSuccessServerResponseDto<T>(
  result: T
): ServerResponseDto<T> {
  return {
    success: true,
    errors: [],
    result,
  };
}

export function makeErrorServerResponseDto(
  errors: string[]
): ServerResponseDto<null> {
  return {
    success: false,
    errors,
    result: null,
  };
}
