import envConfig from "../../../../config.js";
import CreateRefreshTokenCookieUsecase from "./CreateRefreshTokenCookieUsecase.js";

const createRefreshTokenCookie = new CreateRefreshTokenCookieUsecase(
  envConfig.SERVER_DOMAIN
);

export default createRefreshTokenCookie;
