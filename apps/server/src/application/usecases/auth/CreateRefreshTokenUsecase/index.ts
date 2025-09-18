import { DateUtil, JwtUtil, TimeConverter } from "@kanban/utils";
import CreateRefreshTokenUsecase from "./CreateRefreshTokenUsecase.js";
import envConfig from "../../../../config.js";

const createRefreshToken = new CreateRefreshTokenUsecase(
  new JwtUtil(),
  envConfig.JWT_SECRET.REFRESH_TOKEN,
  new TimeConverter(),
  new DateUtil()
);

export default createRefreshToken;
