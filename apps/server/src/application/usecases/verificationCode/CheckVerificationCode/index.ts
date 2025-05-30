import envConfig from "../../../../config.js";
import verificationCodeRepository from "../../../../infrastructure/repositories/verificationCode/index.js";
import CheckVerificationCodeUsecase from "./CheckVerificationCodeUsecase.js";
import { CryptoUtil, DateUtil } from "@kanban/utils";

const checkVerificationCode = new CheckVerificationCodeUsecase(
  new CryptoUtil(),
  verificationCodeRepository,
  envConfig.HASH_SECRET.VERIFICATION_CODE,
  new DateUtil()
);

export default checkVerificationCode;
