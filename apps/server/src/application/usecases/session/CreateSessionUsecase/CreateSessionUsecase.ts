import { QueryDb } from "../../../../db/index.js";
import SessionFactory from "../../../../domain/session/SessionFactory.js";
import SessionRepository from "../../../../infrastructure/repositories/session/SessionRepository.js";

class CreateSessionUsecase {
  constructor(
    private readonly _sessionFactory: SessionFactory,
    private readonly _sessionRepository: SessionRepository
  ) {}

  execute = async (
    userId: string,
    refreshToken: string,
    transactionQuery?: QueryDb
  ) => {
    const newSession = this._sessionFactory.create(userId, refreshToken);

    return await this._sessionRepository.create(newSession, {
      transactionQuery,
    });
  };
}

export default CreateSessionUsecase;
