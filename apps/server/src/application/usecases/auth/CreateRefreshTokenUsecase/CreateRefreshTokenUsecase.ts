import { JwtUtil } from "@kanban/utils";
import { SESSION_EXPIRE_TIME_IN_MS } from "../../../../domain/session/index.js";

export type RefreshTokenPayload = { id: string };

class CreateRefreshTokenUsecase {
  constructor(
    private readonly _jwt: JwtUtil,
    private readonly _refreshTokenSecret: string
  ) {}

  execute = async (id: string) => {
    return await this._jwt.sign<RefreshTokenPayload>(
      { id },
      this._refreshTokenSecret,
      SESSION_EXPIRE_TIME_IN_MS
    );
  };
}

export default CreateRefreshTokenUsecase;
