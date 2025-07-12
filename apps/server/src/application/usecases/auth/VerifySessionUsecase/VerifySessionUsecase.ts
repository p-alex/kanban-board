import DateUtil from "../../../../../../../packages/utils/dist/DateUtil.js";
import JwtUtil from "../../../../../../../packages/utils/dist/JwtUtil.js";
import AppException from "../../../../exceptions/AppException.js";
import SessionRepository from "../../../../infrastructure/repositories/session/SessionRepository.js";
import UserRepository from "../../../../infrastructure/repositories/user/UserRepository.js";
import FindSessionUsecase from "../../session/FindSessionUsecase/FindSessionUsecase.js";
import { RefreshTokenPayload } from "../CreateRefreshTokenUsecase/CreateRefreshTokenUsecase.js";

class VerifySessionUsecase {
  constructor(
    private readonly _jwt: JwtUtil,
    private readonly _refreshTokenJwtSecret: string,
    private readonly _findSession: FindSessionUsecase,
    private readonly _userRepository: UserRepository,
    private readonly _date: DateUtil,
    private readonly _sessionRepository: SessionRepository
  ) {}

  execute = async (refreshToken: string) => {
    if (!refreshToken)
      throw new AppException(401, ["No refresh token provided"]);

    const payload = await this._jwt.verify<RefreshTokenPayload>(
      refreshToken,
      this._refreshTokenJwtSecret
    );

    const session = await this._findSession.execute(refreshToken);

    if (!session) throw new AppException(401, ["Invalid refresh token"]);

    if (this._date.dateStringToMs(session.expires_at) < this._date.now()) {
      await this._sessionRepository.deleteByToken(session.token, {});
      throw new AppException(401, ["Invalid refresh token"]);
    }

    const user = await this._userRepository.findById(payload.id);

    if (!user) {
      await this._sessionRepository.deleteByToken(session.token, {});
      throw new AppException(401, [
        "Refresh token is associated with a user that does not exist",
      ]);
    }

    return { user, session };
  };
}

export default VerifySessionUsecase;
