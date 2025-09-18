import { beforeEach, describe, expect, it, Mock, vi } from "vitest";
import BoardColumnFactory, { BoardListData } from "./BoardListFactory.js";
import IBoardColumn from "./IBoardList.js";

describe("BoardColumnFactory.ts", () => {
  let randomUUID: Mock;
  let getUtcOfNow: Mock;

  let boardColumnFactory: BoardColumnFactory;

  const boardColumnData: BoardListData = {
    title: "title",
    board_id: "board_id",
    index: 9,
  };

  beforeEach(() => {
    randomUUID = vi.fn().mockReturnValue("uuid");
    getUtcOfNow = vi.fn().mockReturnValue("currentUTC");

    boardColumnFactory = new BoardColumnFactory(randomUUID, getUtcOfNow);
  });

  it("should assign random uuid to id", () => {
    const column = boardColumnFactory.create(boardColumnData);

    expect(randomUUID).toHaveBeenCalled();
    expect(column.id).toBe("uuid");
  });

  it("should assign current utc date to created_at", () => {
    const column = boardColumnFactory.create(boardColumnData);

    expect(getUtcOfNow).toHaveBeenCalled();
    expect(column.created_at).toBe("currentUTC");
  });

  it("should create a board column", () => {
    const column = boardColumnFactory.create(boardColumnData);

    const expectedColumn: IBoardColumn = {
      id: "uuid",
      board_id: boardColumnData.board_id,
      title: boardColumnData.title,
      index: boardColumnData.index,
      created_at: "currentUTC",
    };

    expect(column).toEqual(expectedColumn);
  });
});
