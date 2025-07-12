import envConfig from "../../../../config.js";
import userToDto from "../../../../domain/user/userToDto.js";
import sessionRepository from "../../../../infrastructure/repositories/session/index.js";
import createAccessToken from "../../../usecases/auth/CreateAccessTokenUsecase/index.js";
import createRefreshToken from "../../../usecases/auth/CreateRefreshTokenUsecase/index.js";
import verifySessionUsecase from "../../../usecases/auth/VerifySessionUsecase/index.js";
import RefreshSessionService from "./RefreshSessionService.js";
import { CryptoUtil, DateUtil } from "@kanban/utils";

const refreshSessionService = new RefreshSessionService(
  createAccessToken,
  createRefreshToken,
  verifySessionUsecase,
  sessionRepository,
  new CryptoUtil(),
  envConfig.HASH_SECRET.SESSION,
  userToDto,
  new DateUtil()
);

export default refreshSessionService;
