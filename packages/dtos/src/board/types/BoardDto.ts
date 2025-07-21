import z from "zod";
import { boardDtoSchema } from "../schemas/boardDto.schema.js";

export type BoardDto = z.infer<typeof boardDtoSchema>;
