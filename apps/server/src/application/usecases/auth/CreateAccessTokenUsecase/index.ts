import envConfig from "../../../../config.js";
import CreateAccessTokenUsecase from "./CreateAccessTokenUsecase.js";
import { DateUtil, JwtUtil, TimeConverter } from "@kanban/utils";

const createAccessToken = new CreateAccessTokenUsecase(
  new JwtUtil(),
  envConfig.JWT_SECRET.ACCESS_TOKEN,
  new TimeConverter(),
  new DateUtil()
);

export default createAccessToken;
