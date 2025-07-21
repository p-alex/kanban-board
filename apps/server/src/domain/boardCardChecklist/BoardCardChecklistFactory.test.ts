import { beforeEach, describe, expect, it, Mock, vi } from "vitest";
import BoardCardChecklistFactory, {
  BoardCardChecklistData,
} from "./BoardCardChecklistFactory.js";
import IBoardCardChecklist from "./IBoardCardChecklist.js";

describe("BoardCardChecklistFactory.ts", () => {
  let randomUUID: Mock;
  let getUtcOfNow: Mock;
  let boardCardChecklistFactory: BoardCardChecklistFactory;

  const checklistData: BoardCardChecklistData = {
    title: "title",
    index: 0,
    board_card_id: "board_card_id",
  };

  beforeEach(() => {
    randomUUID = vi.fn().mockReturnValue("uuid");
    getUtcOfNow = vi.fn().mockReturnValue("date");

    boardCardChecklistFactory = new BoardCardChecklistFactory(
      randomUUID,
      getUtcOfNow
    );
  });

  it("should assign random uuid to id", () => {
    const result = boardCardChecklistFactory.create(checklistData);

    expect(randomUUID).toHaveBeenCalled();

    expect(result.id).toBe("uuid");
  });

  it("should assign utc date of now to created_at using the getUtcOfNow function", () => {
    const result = boardCardChecklistFactory.create(checklistData);

    expect(getUtcOfNow).toHaveBeenCalled();

    expect(result.created_at).toBe("date");
  });

  it("should return a board card checklist", () => {
    const result = boardCardChecklistFactory.create(checklistData);

    const expectedResult: IBoardCardChecklist = {
      id: "uuid",
      title: checklistData.title,
      board_card_id: checklistData.board_card_id,
      created_at: "date",
      index: checklistData.index,
    };

    expect(result).toEqual(expectedResult);
  });
});
