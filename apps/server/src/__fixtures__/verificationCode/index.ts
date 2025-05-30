import IVerificationCode from "../../domain/verificationCode/IVerificationCode.js";

export const verificationCodeFixture: IVerificationCode = {
  id: "id",
  code: "code",
  user_id: "user_id",
  type: "user_verification",
  created_at: "created_at",
  expires_at: "expires_at",
};
