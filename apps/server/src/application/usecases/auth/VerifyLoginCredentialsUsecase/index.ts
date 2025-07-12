import envConfig from "../../../../config.js";
import userRepository from "../../../../infrastructure/repositories/user/index.js";
import VerifyLoginCredentialsUsecase from "./VerifyLoginCredentialsUsecase.js";
import { CryptoUtil } from "@kanban/utils";

const verifyLoginCredentialsUsecase = new VerifyLoginCredentialsUsecase(
  new CryptoUtil(),
  envConfig.HASH_SECRET.EMAIL,
  userRepository
);

export default verifyLoginCredentialsUsecase;
