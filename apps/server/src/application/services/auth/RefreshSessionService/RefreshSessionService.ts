import { CryptoUtil, DateUtil } from "@kanban/utils";
import CreateRefreshTokenUsecase from "../../../usecases/auth/CreateRefreshTokenUsecase/CreateRefreshTokenUsecase.js";
import CreateAccessTokenUsecase from "../../../usecases/auth/CreateAccessTokenUsecase/CreateAccessTokenUsecase.js";
import SessionRepository from "../../../../infrastructure/repositories/session/SessionRepository.js";
import { UserToDto } from "../../../../domain/user/userToDto.js";
import VerifySessionUsecase from "../../../usecases/auth/VerifySessionUsecase/VerifySessionUsecase.js";
import ISession from "../../../../domain/session/ISession.js";

class RefreshSessionService {
  constructor(
    private readonly _createAccessToken: CreateAccessTokenUsecase,
    private readonly _createRefreshToken: CreateRefreshTokenUsecase,
    private readonly _verifySession: VerifySessionUsecase,
    private readonly _sessionRepository: SessionRepository,
    private readonly _crypto: CryptoUtil,
    private readonly _refreshTokenHashSecret: string,
    private readonly _userToDto: UserToDto,
    private readonly _date: DateUtil
  ) {}

  execute = async (refreshToken: string) => {
    const { user, session } = await this._verifySession.execute(refreshToken);

    const newAccessToken = await this._createAccessToken.execute(
      session.user_id
    );

    const newRefreshToken = await this._createRefreshToken.execute(
      session.user_id
    );

    const updatedSession: ISession = {
      ...session,
      token: this._crypto.hmacSHA256(
        newRefreshToken,
        this._refreshTokenHashSecret
      ),
    };

    await this._sessionRepository.update(updatedSession, {});

    return {
      userDto: this._userToDto(user),
      newAccessToken,
      newRefreshToken,
      newRefreshTokenCookieMaxAgeInMs:
        this._date.dateStringToMs(session.expires_at) - this._date.now(),
    };
  };
}

export default RefreshSessionService;
