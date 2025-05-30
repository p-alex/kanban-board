import envConfig from "../../config.js";
import VerificationCodeFactory from "./VerificationCodeFactory.js";
import { CryptoUtil, DateUtil, TimeConverter } from "@kanban/utils";

const verificationCodeFactory = new VerificationCodeFactory(
  new CryptoUtil(),
  new DateUtil(),
  new TimeConverter(),
  envConfig.HASH_SECRET.VERIFICATION_CODE
);

export default verificationCodeFactory;
