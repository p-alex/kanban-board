import { ServerResponseDto } from "@kanban/dtos/ServerResponseDto";
import { EmailVerificationRequestDto } from "@kanban/dtos/VerificationCodeDtoTypes";
import { EmailVerificationFormData } from "../../../../components/Forms/EmailVerificationForm/EmailVerificationFormValidation";
import { httpClient } from "../../../../utils/HttpClient";
import createResponse from "../../../createResponse";
import { Response } from "..";

async function verifyEmailUsecase(
  data: EmailVerificationFormData
): Promise<Response<null>> {
  const body: EmailVerificationRequestDto = {
    verification_code: data.verificationCode,
  };

  const result: ServerResponseDto<null> = await httpClient.mutate(
    "/users/verify-email",
    "POST",
    body,
    {}
  );

  return createResponse<null>({
    code: result.code,
    errors: result.errors,
    result: null,
    success: result.success,
  });
}

export type VerifyEmailUsecase = typeof verifyEmailUsecase;

export default verifyEmailUsecase;
