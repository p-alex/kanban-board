import z from "zod";
import boardListDtoSchema from "../schemas/boardListDto.schema.js";

export type BoardListDto = z.infer<typeof boardListDtoSchema>;
