import { z } from "zod";
import { BoardSchema } from "./Board.js";
import { CryptoUtil, DateUtil } from "@kanban/utils";
import generateHexColor, {
  GenerateHexColor,
} from "../../utils/generateHexColor.js";

export const BoardColumnSchema = z.object({
  id: z.string().uuid(),
  boardId: BoardSchema.shape.id,
  userId: z.string().uuid(),
  title: z.string().min(1, "Can't be empty").max(24, "Max 24 characters"),
  index: z.number(),
  hexColor: z.string().length(7, "Invalid hex color"),
  createdAt: z.string(),
});

class BoardColumnFactory {
  constructor(
    private readonly _cryptoUtil: CryptoUtil,
    private readonly _dateUtil: DateUtil,
    private readonly _generateHexColor: GenerateHexColor
  ) {}

  create({
    boardId,
    userId,
    title,
    index,
  }: {
    boardId: string;
    userId: string;
    title: string;
    index: number;
  }) {
    return {
      id: this._cryptoUtil.randomUUID(),
      boardId,
      userId,
      title,
      hexColor: this._generateHexColor(),
      index,
      createdAt: this._dateUtil.getUtcOfNow(),
    };
  }
}

export const boardColumFactory = new BoardColumnFactory(
  new CryptoUtil(),
  new DateUtil(),
  generateHexColor
);

type BoardColumn = z.infer<typeof BoardColumnSchema>;

export default BoardColumn;
