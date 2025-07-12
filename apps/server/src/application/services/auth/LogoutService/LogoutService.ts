import TransactionManager from "../../../../db/TransactionManager/TransactionManager.js";
import AppException from "../../../../exceptions/AppException.js";
import SessionRepository from "../../../../infrastructure/repositories/session/SessionRepository.js";
import FindSessionUsecase from "../../../usecases/session/FindSessionUsecase/FindSessionUsecase.js";

class LogoutService {
  constructor(
    private readonly _transactionManager: TransactionManager,
    private readonly _findSession: FindSessionUsecase,
    private readonly _sessionRepository: SessionRepository
  ) {}

  execute = async (user_id: string, refresh_token: string) => {
    return await this._transactionManager.run(async (query) => {
      const session = await this._findSession.execute(refresh_token, query);

      if (!session)
        throw new AppException(401, [
          "Cannot logout because there is no session",
        ]);

      if (session.user_id !== user_id)
        throw new AppException(401, ["Not allowed"]);

      await this._sessionRepository.deleteByToken(session.token, {
        transactionQuery: query,
      });
    });
  };
}

export default LogoutService;
