import { QueryDb } from "../../../../db/index.js";
import IVerificationCode from "../../../../domain/verificationCode/IVerificationCode.js";
import AppException from "../../../../exceptions/AppException.js";
import VerificationCodeRepository from "../../../../infrastructure/repositories/verificationCode/VerificationCodeRepository.js";
import { CryptoUtil, DateUtil } from "@kanban/utils";

class CheckVerificationCodeUsecase {
  constructor(
    private readonly _crypto: CryptoUtil,
    private readonly _verificationCodeRepository: VerificationCodeRepository,
    private readonly _verificationCodeHashSecret: string,
    private readonly _date: DateUtil
  ) {}

  execute = async (
    code: string,
    type: IVerificationCode["type"],
    transactionQuery?: QueryDb
  ) => {
    const hashedCode = this._crypto.hmacSHA256(
      code,
      this._verificationCodeHashSecret
    );

    const verificationCode = await this._verificationCodeRepository.findByCode(
      hashedCode,
      { transactionQuery }
    );

    if (!verificationCode) {
      throw new AppException(401, "Invalid code");
    }

    if (verificationCode.type !== type)
      throw new AppException(401, "Invalid code");

    if (this._date.isDateInThePast(verificationCode.expires_at)) {
      await this._verificationCodeRepository.deleteByCode(hashedCode, {
        transactionQuery,
      });
      throw new AppException(
        401,
        "Code expired. Log in again to trigger another account verification process."
      );
    }

    return verificationCode;
  };
}

export default CheckVerificationCodeUsecase;
