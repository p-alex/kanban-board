import { beforeEach, describe, expect, it, Mock, vi } from "vitest";
import BoardCardChecklistItemFactory from "./BoardCardChecklistItemFactory.js";
import IBoardCardChecklistItem from "./IBoardCardChecklistItem.js";

describe("BoardCardChecklistItemFactory.ts", () => {
  let randomUUID: Mock;
  let getUtcOfNow: Mock;
  let checklistItemFactory: BoardCardChecklistItemFactory;

  beforeEach(() => {
    randomUUID = vi.fn().mockReturnValue("uuid");
    getUtcOfNow = vi.fn().mockReturnValue("current_utc");
    checklistItemFactory = new BoardCardChecklistItemFactory(
      randomUUID,
      getUtcOfNow
    );
  });

  it("should assign random uuid to id", () => {
    const item = checklistItemFactory.create({
      board_checklist_id: "board_checklist_id",
      title: "title",
    });

    expect(randomUUID).toHaveBeenCalled();
    expect(item.id).toBe("uuid");
  });

  it("should create a checklist item", () => {
    const item = checklistItemFactory.create({
      board_checklist_id: "board_checklist_id",
      title: "title",
    });

    const expectedItem: IBoardCardChecklistItem = {
      id: "uuid",
      board_checklist_id: "board_checklist_id",
      is_done: false,
      title: "title",
      index: 0,
      created_at: "current_utc",
    };

    expect(item).toEqual(expectedItem);
  });
});
