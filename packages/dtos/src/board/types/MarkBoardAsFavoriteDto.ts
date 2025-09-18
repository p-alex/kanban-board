import z from "zod";
import { markBoardAsFavoriteRequestDto } from "../schemas/markBoardAsFavorite.schema.js";

export type MarkBoardAsFavoriteRequestDto = z.infer<
  typeof markBoardAsFavoriteRequestDto
>;
