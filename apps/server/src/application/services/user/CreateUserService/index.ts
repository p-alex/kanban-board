import transactionManager from "../../../../db/TransactionManager/index.js";
import userToDto from "../../../../domain/user/userToDto.js";
import { sendAccountVerificationEmail } from "../../../usecases/email/index.js";
import {
  checkIfUsernameIsUnique,
  checkIfEmailIsUnique,
  createUser,
} from "../../../usecases/user/index.js";
import { createVerificationCode } from "../../../usecases/verificationCode/index.js";
import CreateUserService from "./CreateUserService.js";

const createUserService = new CreateUserService(
  transactionManager,
  checkIfUsernameIsUnique,
  checkIfEmailIsUnique,
  createUser,
  createVerificationCode,
  sendAccountVerificationEmail,
  userToDto
);

export default createUserService;
