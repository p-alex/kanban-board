import { afterEach, beforeEach, describe, expect, it, Mock, vi } from "vitest";
import Database, { DatabaseConfig } from "./Database.js";
import pg from "pg";

vi.mock("pg", () => {
  return {
    default: {
      Pool: vi.fn(),
    },
  };
});

describe("Database.ts", () => {
  const testConfig: DatabaseConfig = {
    database: "",
    host: "",
    password: "",
    port: 12,
    user: "",
  };

  const connectMock = vi.fn();
  const endMock = vi.fn();
  const queryMock = vi.fn();
  const releaseMock = vi.fn();

  let database: Database;

  beforeEach(() => {
    (pg.Pool as unknown as Mock).mockImplementation(() => ({
      connect: connectMock,
      end: endMock,
    }));

    connectMock.mockResolvedValue({
      query: queryMock,
      release: releaseMock,
    });

    database = new Database(testConfig);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("should apply database config", () => {
    expect(pg.Pool).toHaveBeenCalledWith(testConfig);
  });

  it("should get pool correctly", () => {
    const pool = database.getPool();

    expect(pool).toEqual({ connect: connectMock, end: endMock });
  });

  it("should end pool correctly", async () => {
    await database.endPool();

    expect(endMock).toHaveBeenCalled();
  });

  it("should handle successfull ping correctly", async () => {
    await database.ping();

    expect(connectMock).toHaveBeenCalled();
    expect(queryMock).toHaveBeenCalledWith("SELECT 1");
    expect(releaseMock).toHaveBeenCalled();
  });

  it("should handle failed ping correctly", async () => {
    const consoleSpy = vi.spyOn(console, "log");
    connectMock.mockRejectedValue("error");

    await database.ping();

    expect(connectMock).toHaveBeenCalled();
    expect(releaseMock).not.toHaveBeenCalled();
    expect(consoleSpy).toHaveBeenCalledWith("Failed to ping database");
  });
});
