import transactionManager from "../../../../db/TransactionManager/index.js";
import verificationCodeRepository from "../../../../infrastructure/repositories/verificationCode/index.js";
import { markUserAsVerified } from "../../../usecases/user/index.js";
import { checkVerificationCode } from "../../../usecases/verificationCode/index.js";
import VerifiyUserService from "./VerifiyUserService.js";

const verifyUserService = new VerifiyUserService(
  transactionManager,
  checkVerificationCode,
  markUserAsVerified,
  verificationCodeRepository
);

export default verifyUserService;
