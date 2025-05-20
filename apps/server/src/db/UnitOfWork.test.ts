import { beforeEach, describe, expect, it, Mock, Mocked, vi } from "vitest";
import UnitOfWork from "./UnitOfWork.js";
import Database from "./Database.js";
import { PoolClient } from "pg";

describe("UnitOfWork.ts", () => {
  let unitOfWork: UnitOfWork;

  const mockDatabase = {
    getPool: vi.fn(),
    endPool: vi.fn(),
    ping: vi.fn(),
  } as unknown as Mocked<Database>;

  beforeEach(() => {
    unitOfWork = new UnitOfWork(mockDatabase);
  });

  it("start function should start transaction correctly", async () => {
    const queryMock = vi.fn();

    (mockDatabase.getPool as Mock).mockReturnValue({
      connect: vi.fn().mockResolvedValue({
        query: queryMock,
      }),
    });

    const result = await unitOfWork.start();

    expect(queryMock).toHaveBeenCalledWith("BEGIN");
    expect(result).toHaveProperty("query");
    expect(result).toHaveProperty("complete");
    expect(result).toHaveProperty("rollback");
    expect(result).toHaveProperty("release");
  });

  it("start function should handle failed transaction correctly", async () => {
    const queryMock = vi.fn().mockRejectedValue("error");
    const releaseMock = vi.fn();

    (mockDatabase.getPool as Mock).mockReturnValue({
      connect: vi.fn().mockResolvedValue({
        query: queryMock,
        release: releaseMock,
      }),
    });

    try {
      await unitOfWork.start();
    } catch (error) {
      expect(queryMock).rejects.toThrow();
      expect(releaseMock).toHaveBeenCalled();
    }
  });

  it("complete transaction should work correctly", async () => {
    const queryMock = vi.fn().mockResolvedValue("result");

    const complete = unitOfWork.complete({
      query: queryMock,
    } as unknown as PoolClient);

    await complete();

    expect(queryMock).toHaveBeenCalledWith("COMMIT");
  });

  it("rollback transaction should work correctly", async () => {
    const queryMock = vi.fn().mockResolvedValue("result");

    const rollback = unitOfWork.rollback({
      query: queryMock,
    } as unknown as PoolClient);

    await rollback();

    expect(queryMock).toHaveBeenCalledWith("ROLLBACK");
  });

  it("release client should work correctly", async () => {
    const releaseMock = vi.fn();

    const release = unitOfWork.release({
      release: releaseMock,
    } as unknown as PoolClient);

    release();

    expect(releaseMock).toHaveBeenCalled();
  });

  it("transaction query should work correctly", async () => {
    const queryMock = vi.fn().mockResolvedValue({ rows: [{ data: "data" }] });

    const query = unitOfWork.query({
      query: queryMock,
    } as unknown as PoolClient);

    const result = await query("test", []);

    expect(result).toEqual([{ data: "data" }]);
  });
});
