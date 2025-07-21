import { beforeEach, describe, expect, it, Mock, vi } from "vitest";
import BoardCardFactory, { BoardCardData } from "./BoardCardFactory.js";
import IBoardCard from "./IBoardCard.js";

describe("BoardCardFactory.ts", () => {
  let randomUUID: Mock;
  let getUtcOfNow: Mock;

  let boardCardFactory: BoardCardFactory;

  const boardCardData: BoardCardData = {
    board_column_id: "board_column_id",
    title: "title",
    index: 0,
  };

  beforeEach(() => {
    randomUUID = vi.fn().mockReturnValue("uuid");
    getUtcOfNow = vi.fn().mockReturnValue("currentUTC");

    boardCardFactory = new BoardCardFactory(randomUUID, getUtcOfNow);
  });

  it("should assign random uuid to id", () => {
    const boardCard = boardCardFactory.create(boardCardData);

    expect(randomUUID).toHaveBeenCalled();
    expect(boardCard.id).toBe("uuid");
  });

  it("should assign current utc date to created_at", () => {
    const boardCard = boardCardFactory.create(boardCardData);

    expect(getUtcOfNow).toHaveBeenCalled();
    expect(boardCard.created_at).toBe("currentUTC");
  });

  it("should create a board card", () => {
    const boardCard = boardCardFactory.create(boardCardData);

    const resultBoardCard: IBoardCard = {
      id: "uuid",
      ...boardCardData,
      cover: "",
      created_at: "currentUTC",
      description: "",
      is_done: false,
    };

    expect(boardCard).toEqual(resultBoardCard);
  });
});
