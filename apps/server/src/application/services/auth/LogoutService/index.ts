import transactionManager from "../../../../db/TransactionManager/index.js";
import sessionRepository from "../../../../infrastructure/repositories/session/index.js";
import findSessionUsecase from "../../../usecases/session/FindSessionUsecase/index.js";
import LogoutService from "./LogoutService.js";

const logoutService = new LogoutService(
  transactionManager,
  findSessionUsecase,
  sessionRepository
);

export default logoutService;
