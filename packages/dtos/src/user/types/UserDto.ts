import { z } from "zod";
import { userDtoSchema } from "../schemas/userDto.schema.js";

export type UserDto = z.infer<typeof userDtoSchema>;
