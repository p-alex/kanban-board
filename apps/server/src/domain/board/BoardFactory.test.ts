import { beforeEach, describe, expect, it, Mock, vi } from "vitest";
import BoardFactory, { BoardFactoryData } from "./BoardFactory.js";
import IBoard from "./IBoard.js";

describe("BoardFactory.ts", () => {
  let randomUUID: Mock;
  let getUtcOfNow: Mock;

  beforeEach(() => {
    randomUUID = vi.fn().mockReturnValue("uuid");
    getUtcOfNow = vi.fn().mockReturnValue("currentUTC");
  });

  const boardFactoryData: BoardFactoryData = {
    title: "title",
    user_id: "user_id",
    status: "public",
  };

  it("should assign a random uuid to id", () => {
    const boardFactory = new BoardFactory(randomUUID, getUtcOfNow);

    const board = boardFactory.create(boardFactoryData);

    expect(randomUUID).toHaveBeenCalled();

    expect(board.id).toBe("uuid");
  });

  it("should assign current utc date to created_at and last_accessed_at", () => {
    const board = new BoardFactory(randomUUID, getUtcOfNow).create(
      boardFactoryData
    );

    expect(getUtcOfNow).toHaveBeenCalledTimes(1);

    expect(board.created_at).toBe("currentUTC");
  });

  it("should create a board", () => {
    const board = new BoardFactory(randomUUID, getUtcOfNow).create(
      boardFactoryData
    );

    const resultBoard: IBoard = {
      id: "uuid",
      title: "title",
      status: "public",
      created_at: "currentUTC",
    };

    expect(board).toEqual(resultBoard);
  });
});
