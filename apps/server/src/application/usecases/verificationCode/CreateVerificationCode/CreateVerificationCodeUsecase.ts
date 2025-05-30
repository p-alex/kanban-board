import { CryptoUtil } from "@kanban/utils";
import VerificationCodeFactory from "../../../../domain/verificationCode/VerificationCodeFactory.js";
import VerificationCodeRepository from "../../../../infrastructure/repositories/verificationCode/VerificationCodeRepository.js";
import IVerificationCode from "../../../../domain/verificationCode/IVerificationCode.js";
import { QueryDb } from "../../../../db/index.js";

class CreateVerificationCodeUsecase {
  constructor(
    private readonly _crypto: CryptoUtil,
    private readonly _verificationCodeFactory: VerificationCodeFactory,
    private readonly _verificationCodeRepository: VerificationCodeRepository
  ) {}

  execute = async (
    user_id: string,
    type: IVerificationCode["type"],
    transactionQuery?: QueryDb
  ) => {
    const code = this._crypto.generateCode(8);

    const newVerificationCode = this._verificationCodeFactory.create(
      user_id,
      code,
      type
    );

    await this._verificationCodeRepository.create(newVerificationCode, {
      transactionQuery,
    });

    return code;
  };
}

export default CreateVerificationCodeUsecase;
