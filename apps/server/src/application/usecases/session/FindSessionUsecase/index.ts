import envConfig from "../../../../config.js";
import sessionRepository from "../../../../infrastructure/repositories/session/index.js";
import FindSessionUsecase from "./FindSessionUsecase.js";
import { CryptoUtil } from "@kanban/utils";

const findSessionUsecase = new FindSessionUsecase(
  new CryptoUtil().hmacSHA256,
  envConfig.HASH_SECRET.SESSION,
  sessionRepository
);

export default findSessionUsecase;
