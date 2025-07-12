import sessionFactory from "../../../../domain/session/index.js";
import sessionRepository from "../../../../infrastructure/repositories/session/index.js";
import CreateSessionUsecase from "./CreateSessionUsecase.js";

const createSessionUsecase = new CreateSessionUsecase(
  sessionFactory,
  sessionRepository
);

export default createSessionUsecase;
