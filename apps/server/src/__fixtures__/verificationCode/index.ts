import IVerificationCode from "../../domain/verificationCode/IVerificationCode.js";

export const verificationCodeFixture: IVerificationCode = {
  id: "id",
  code: "code",
  user_id: "user_id",
  type: "email_verification",
  created_at: "created_at",
  expires_at: "expires_at",
};
