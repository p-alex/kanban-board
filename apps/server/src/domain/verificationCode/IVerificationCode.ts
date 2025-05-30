export type VerificationCodeType = "user_verification";

interface IVerificationCode {
  id: string;
  user_id: string;
  code: string;
  type: VerificationCodeType;
  created_at: string;
  expires_at: string;
}

export default IVerificationCode;
