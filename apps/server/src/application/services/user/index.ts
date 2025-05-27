import UserService from "./UserService.js";
import { sendAccountVerificationEmail } from "../../usecases/email/index.js";
import userRepository from "../../../infrastructure/repositories/user/index.js";
import userFactory from "../../../domain/user/index.js";
import verificationCodeFactory from "../../../domain/verificationCode/index.js";

import { CryptoUtil, DateUtil } from "@kanban/utils";
import verificationCodeRepository from "../../../infrastructure/repositories/verificationCode/index.js";
import transactionManager from "../../../db/TransactionManager/index.js";

const userService = new UserService(
  transactionManager,
  userRepository,
  verificationCodeRepository,
  userFactory,
  verificationCodeFactory,
  sendAccountVerificationEmail,
  new CryptoUtil(),
  new DateUtil()
);

export default userService;
