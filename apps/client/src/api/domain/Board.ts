import { CryptoUtil, DateUtil } from "@kanban/utils";
import { z } from "zod";

export const BoardSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  title: z.string().min(1, "Can't be empty").max(32, "Max 32 letters"),
  createdAt: z.string(),
});

class BoardFactory {
  constructor(
    private readonly _cryptoUtil: CryptoUtil,
    private readonly _dateUtil: DateUtil
  ) {}

  create({ userId, title }: Pick<Board, "title" | "userId">): Board {
    return {
      id: this._cryptoUtil.randomUUID(),
      userId,
      title,
      createdAt: this._dateUtil.getUtcOfNow(),
    };
  }
}

export const boardFactory = new BoardFactory(new CryptoUtil(), new DateUtil());

export type Board = z.infer<typeof BoardSchema>;

export default Board;
