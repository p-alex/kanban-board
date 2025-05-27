import UnitOfWork from "../UnitOfWork.js";

class TransactionManager {
  constructor(private readonly _unitOfWork: UnitOfWork) {}

  run = async <T>(
    work: (
      query: Awaited<Awaited<ReturnType<UnitOfWork["start"]>>["query"]>
    ) => Promise<T>
  ) => {
    const uow = await this._unitOfWork.start();

    try {
      const result = await work(uow.query);

      uow.complete();

      return result;
    } catch (error) {
      await uow.rollback();
      throw error;
    } finally {
      uow.release();
    }
  };
}

export default TransactionManager;
