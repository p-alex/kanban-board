import z from "zod";
import { unmarkBoardAsFavoriteRequestDto } from "../schemas/unmarkBoardAsFavorite.schema.js";

export type UnmarkBoardAsFavoriteRequestDto = z.infer<
  typeof unmarkBoardAsFavoriteRequestDto
>;
