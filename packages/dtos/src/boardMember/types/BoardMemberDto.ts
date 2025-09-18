import z from "zod";
import boardMemberDtoSchema from "../schemas/boardMemberDto.schema.js";

export type BoardMemberDto = z.infer<typeof boardMemberDtoSchema>;
