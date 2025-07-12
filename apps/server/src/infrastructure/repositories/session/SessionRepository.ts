import { QueryDb } from "../../../db/index.js";
import ISession from "../../../domain/session/ISession.js";
import { RepositoryOptions } from "../index.js";

class SessionRepository {
  constructor(private readonly _queryDB: QueryDb) {}

  findByToken = async (token: string, options: RepositoryOptions) => {
    const queryFunc = this.getQueryFunction(options);

    const result = await queryFunc<ISession>(
      "SELECT * FROM sessions WHERE token = $1",
      [token]
    );

    return result[0];
  };

  create = async (session: ISession, options: RepositoryOptions) => {
    const queryFunc = this.getQueryFunction(options);

    const result = await queryFunc<ISession>(
      "INSERT INTO sessions (id, user_id, token, created_at, last_accessed_at, expires_at) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
      [
        session.id,
        session.user_id,
        session.token,
        session.created_at,
        session.last_accessed_at,
        session.expires_at,
      ]
    );

    return result[0];
  };

  update = async (updatedSession: ISession, options: RepositoryOptions) => {
    const queryFunc = this.getQueryFunction(options);

    const result = await queryFunc<ISession>(
      "UPDATE sessions SET token = $1, last_accessed_at = $2 WHERE id = $3",
      [updatedSession.token, updatedSession.last_accessed_at, updatedSession.id]
    );

    return result[0];
  };

  deleteByToken = async (token: string, options: RepositoryOptions) => {
    const queryFunc = this.getQueryFunction(options);

    const result = await queryFunc<ISession>(
      "DELETE FROM sessions WHERE token = $1 RETURNING *",
      [token]
    );

    return result[0];
  };

  private getQueryFunction = (options?: RepositoryOptions) => {
    return options?.transactionQuery !== undefined
      ? options.transactionQuery
      : this._queryDB;
  };
}

export default SessionRepository;
