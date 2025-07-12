import envConfig from "../../config.js";
import httpResponseFactory from "../../HttpResponseFactory/index.js";
import AuthShield from "./AuthShield.js";
import { JwtUtil } from "@kanban/utils";

export interface IAuthenticatedUser {
  id: string;
}

const authShield = new AuthShield(
  new JwtUtil(),
  envConfig.JWT_SECRET.ACCESS_TOKEN,
  httpResponseFactory
);

export default authShield;
