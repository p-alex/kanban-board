import z from "zod";
import { userDtoSchema } from "../../user/schemas/userDto.schema.js";

export const boardDtoSchema = z.object({
  id: z.string({ required_error: "Board id is required" }).uuid(),
  user_id: userDtoSchema.shape.id,
  title: z
    .string({ required_error: "Board title is required" })
    .min(1)
    .max(256),
  is_favorite: z.boolean(),
  status: z.enum(["public", "private"], {
    required_error: "Board status is required",
  }),
  created_at: z.string({ required_error: "Board created_at is required" }),
  last_accessed_at: z.string({
    required_error: "Board last_accessed_at is required",
  }),
});
