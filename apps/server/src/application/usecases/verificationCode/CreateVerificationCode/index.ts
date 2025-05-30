import verificationCodeFactory from "../../../../domain/verificationCode/index.js";
import verificationCodeRepository from "../../../../infrastructure/repositories/verificationCode/index.js";
import CreateVerificationCode from "./CreateVerificationCodeUsecase.js";
import { CryptoUtil } from "@kanban/utils";

const createVerificationCode = new CreateVerificationCode(
  new CryptoUtil(),
  verificationCodeFactory,
  verificationCodeRepository
);

export default createVerificationCode;
