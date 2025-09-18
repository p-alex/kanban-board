import { DateUtil, JwtUtil, TimeConverter } from "@kanban/utils";
import { SESSION_EXPIRE_TIME_IN_MS } from "../../../../domain/session/index.js";

export type RefreshTokenPayload = { id: string };

class CreateRefreshTokenUsecase {
  constructor(
    private readonly _jwt: JwtUtil,
    private readonly _refreshTokenSecret: string,
    private readonly _time: TimeConverter,
    private readonly _date: DateUtil
  ) {}

  execute = async (id: string) => {
    const issuedAt = this._time.toSeconds(this._date.now(), "milisecond");
    const expiration = this._time.toSeconds(
      SESSION_EXPIRE_TIME_IN_MS,
      "milisecond"
    );

    return await this._jwt.sign<RefreshTokenPayload>(
      { id },
      this._refreshTokenSecret,
      issuedAt + expiration
    );
  };
}

export default CreateRefreshTokenUsecase;
