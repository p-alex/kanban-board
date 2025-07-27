import z from "zod";
import { getBoardsResponseDto } from "../schemas/getBoards.schema.js";

export type GetBoardsResponseDto = z.infer<typeof getBoardsResponseDto>;
