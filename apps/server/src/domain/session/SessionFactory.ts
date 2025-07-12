import { CryptoUtil, DateUtil } from "@kanban/utils";
import ISession from "./ISession.js";

class SessionFactory {
  constructor(
    private readonly _crypto: CryptoUtil,
    private readonly _date: DateUtil,
    private readonly _sessionHashSecret: string,
    private readonly _sessionExpireTimeInMs: number
  ) {}

  create = (user_id: string, token: string): ISession => {
    return {
      id: this._crypto.randomUUID(),
      user_id,
      token: this._crypto.hmacSHA256(token, this._sessionHashSecret),
      created_at: this._date.getUtcOfNow(),
      last_accessed_at: this._date.getUtcOfNow(),
      expires_at: this._date.toUtcString(
        this._date.now() + this._sessionExpireTimeInMs
      ),
    };
  };
}

export default SessionFactory;
