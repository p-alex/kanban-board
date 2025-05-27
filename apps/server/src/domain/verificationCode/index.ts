import VerificationCodeFactory from "./VerificationCodeFactory.js";
import { CryptoUtil, DateUtil, TimeConverter } from "@kanban/utils";

const verificationCodeFactory = new VerificationCodeFactory(
  new CryptoUtil(),
  new DateUtil(),
  new TimeConverter()
);

export default verificationCodeFactory;
