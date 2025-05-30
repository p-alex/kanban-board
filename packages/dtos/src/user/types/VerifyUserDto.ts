import { z } from "zod";
import { verifyUserRequestDto } from "../schemas/verifyUserDto.schema.js";

export type VerifyUserRequestDto = z.infer<typeof verifyUserRequestDto>;
