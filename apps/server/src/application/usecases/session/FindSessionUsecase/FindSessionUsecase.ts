import { QueryDb } from "../../../../db/index.js";
import SessionRepository from "../../../../infrastructure/repositories/session/SessionRepository.js";
import { CryptoUtil } from "@kanban/utils";

class FindSessionUsecase {
  constructor(
    private readonly _hmacSHA256: CryptoUtil["hmacSHA256"],
    private readonly _sessionHashSecret: string,
    private readonly _sessionRepository: SessionRepository
  ) {}

  execute = async (refreshToken: string, transactionQuery?: QueryDb) => {
    const token = this._hmacSHA256(refreshToken, this._sessionHashSecret);

    return await this._sessionRepository.findByToken(token, {
      transactionQuery,
    });
  };
}

export default FindSessionUsecase;
