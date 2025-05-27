import kanbanDatabase from "../index.js";
import UnitOfWork from "../UnitOfWork.js";
import TransactionManager from "./TransactionManager.js";

const transactionManager = new TransactionManager(
  new UnitOfWork(kanbanDatabase)
);

export default transactionManager;
