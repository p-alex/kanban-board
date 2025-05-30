import { VerifyUserRequestDto } from "@kanban/dtos/UserDtoTypes";
import { AccountVerificationFormData } from "../../../../components/Forms/EmailVerificationForm/EmailVerificationFormValidation";
import { ServerResponseDto } from "@kanban/dtos/ServerResponseDto";
import createResponse from "../../../createResponse";
import { httpClient } from "../../../../utils/HttpClient";

async function verifyAccount(data: AccountVerificationFormData) {
  const body: VerifyUserRequestDto = {
    verification_code: data.verificationCode,
  };

  const result: ServerResponseDto<null> = await httpClient.mutate(
    "/users/verify",
    "POST",
    body,
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  return createResponse<null>({
    code: result.code,
    errors: result.errors,
    result: null,
    success: result.success,
  });
}

export type VerifyAccount = typeof verifyAccount;

export default verifyAccount;
