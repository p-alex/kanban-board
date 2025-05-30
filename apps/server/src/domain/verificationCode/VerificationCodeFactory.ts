import { CryptoUtil, DateUtil, TimeConverter } from "@kanban/utils";
import IVerificationCode, {
  VerificationCodeType,
} from "./IVerificationCode.js";

class VerificationCodeFactory {
  constructor(
    private readonly _crypto: CryptoUtil,
    private readonly _date: DateUtil,
    private readonly _timeConverter: TimeConverter,
    private readonly _verificationCodeHashSecret: string
  ) {}

  create = (
    user_id: string,
    code: string,
    type: VerificationCodeType
  ): IVerificationCode => {
    const hashedCode = this._crypto.hmacSHA256(
      code,
      this._verificationCodeHashSecret
    );

    return {
      id: this._crypto.randomUUID(),
      user_id,
      code: hashedCode,
      type,
      created_at: this._date.getUtcOfNow(),
      expires_at: this._date.toUtcString(
        this._date.now() + this._timeConverter.toMs(15, "minute")
      ),
    };
  };
}

export default VerificationCodeFactory;
