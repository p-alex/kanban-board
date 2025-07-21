import { beforeEach, describe, expect, it, Mock, vi } from "vitest";
import BoardCardStatsFactory, {
  BoardCardStatsData,
} from "./BoardCardStatsFactory.js";
import IBoardCardStats from "./IBoardCardStats.js";

describe("BoardCardStatsFactory.ts", () => {
  let boardCardStatsFactory: BoardCardStatsFactory;

  const statsData: BoardCardStatsData = {
    board_card_id: "board_card_id",
  };

  beforeEach(() => {
    boardCardStatsFactory = new BoardCardStatsFactory();
  });

  it("should create card stats", () => {
    const stats = boardCardStatsFactory.create(statsData);

    const expectedStats: IBoardCardStats = {
      board_card_id: statsData.board_card_id,
      attachments: 0,
      checklist_items: 0,
      checklist_items_done: 0,
      has_description: false,
    };

    expect(stats).toEqual(expectedStats);
  });
});
