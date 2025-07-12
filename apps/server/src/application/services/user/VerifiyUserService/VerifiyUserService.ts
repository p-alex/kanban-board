import TransactionManager from "../../../../db/TransactionManager/TransactionManager.js";
import VerificationCodeRepository from "../../../../infrastructure/repositories/verificationCode/VerificationCodeRepository.js";
import MarkUserAsVerified from "../../../usecases/user/MarkUserAsVerified/MarkUserAsVerifiedUsecase.js";
import CheckVerificationCode from "../../../usecases/verificationCode/CheckVerificationCode/CheckVerificationCodeUsecase.js";

class VerifiyUserService {
  constructor(
    private readonly _transactionManager: TransactionManager,
    private readonly _checkVerificationCode: CheckVerificationCode,
    private readonly _markUserAsVerified: MarkUserAsVerified,
    private readonly _verificationCodeRepository: VerificationCodeRepository
  ) {}

  execute = async (verificationCode: string) => {
    return await this._transactionManager.run(async (transactionQuery) => {
      const code = await this._checkVerificationCode.execute(
        verificationCode,
        "user_verification",
        transactionQuery
      );

      await this._markUserAsVerified.execute(code.user_id, transactionQuery);

      await this._verificationCodeRepository.deleteById(code.id, {
        transactionQuery,
      });
    });
  };
}

export default VerifiyUserService;
