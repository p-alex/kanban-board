import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import UnitOfWork from "../UnitOfWork.js";
import TransactionManager from "./TransactionManager.js";

describe("TransactionManager.ts", () => {
  let unitOfWork: UnitOfWork;

  let transactionManager: TransactionManager;

  let queryMock = vi.fn();
  let completeMock = vi.fn();
  let rollbackMock = vi.fn();
  let releaseMock = vi.fn();

  beforeEach(() => {
    unitOfWork = {
      start: vi.fn().mockResolvedValue({
        complete: completeMock,
        rollback: rollbackMock,
        query: queryMock,
        release: releaseMock,
      }),
    } as unknown as UnitOfWork;

    transactionManager = new TransactionManager(unitOfWork);
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it("should work correctly if successfull transaction", async () => {
    const mockWorkFn = vi.fn().mockResolvedValue({ result: "result" });

    const result = await transactionManager.run(mockWorkFn);

    expect(unitOfWork.start).toHaveBeenCalled();

    expect(mockWorkFn).toHaveBeenCalledWith(queryMock);

    expect(completeMock).toHaveBeenCalled();

    expect(result).toEqual({ result: "result" });
  });

  it("should work correctly if failed transaction", async () => {
    const mockWorkFn = vi.fn().mockRejectedValue({ error: "error" });

    try {
      await transactionManager.run(mockWorkFn);
    } catch (error) {
      expect(unitOfWork.start).toHaveBeenCalled();

      expect(mockWorkFn).toHaveBeenCalledWith(queryMock);

      expect(completeMock).not.toHaveBeenCalled();

      expect(rollbackMock).toHaveBeenCalled();

      expect(releaseMock).toHaveBeenCalled();
    }
  });
});
