import envConfig from "../../../../config.js";
import sessionRepository from "../../../../infrastructure/repositories/session/index.js";
import userRepository from "../../../../infrastructure/repositories/user/index.js";
import findSessionUsecase from "../../session/FindSessionUsecase/index.js";
import VerifySessionUsecase from "./VerifySessionUsecase.js";
import { DateUtil, JwtUtil } from "@kanban/utils";

const verifySessionUsecase = new VerifySessionUsecase(
  new JwtUtil(),
  envConfig.JWT_SECRET.REFRESH_TOKEN,
  findSessionUsecase,
  userRepository,
  new DateUtil(),
  sessionRepository
);

export default verifySessionUsecase;
