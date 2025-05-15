import { CryptoUtil, DateUtil } from "@kanban/utils";
import { z } from "zod";

export const userSchema = z.object({
  id: z.string().uuid(),
  username: z
    .string()
    .min(2, "Min. 2 characters")
    .max(16, "Max. 16 characters")
    .regex(
      /^[a-zA-Z]([a-zA-Z-]+)?[a-zA-Z]$/g,
      "Letters and hyphens in the middle only"
    )
    .trim(),
  email: z.string().email().trim(),
  password: z
    .string()
    .min(8, "Min. 8 characters")
    .max(64, "Max. 64 characters")
    .regex(/[0-9]/g, "Must contain a number")
    .regex(/[a-z]/g, "Must contain lowercase letter")
    .regex(/[A-Z]/g, "Must contain uppercase letter")
    .trim(),
  created_at: z.string(),
});

export type User = z.infer<typeof userSchema>;

class UserFactory {
  constructor(
    private readonly _crypto: CryptoUtil,
    private readonly _date: DateUtil
  ) {}

  create = (userData: Pick<User, "username" | "email" | "password">): User => {
    return {
      id: this._crypto.randomUUID(),
      username: userData.username,
      email: userData.email,
      password: userData.password,
      created_at: this._date.getUtcOfNow(),
    };
  };
}

export const userFactory = new UserFactory(new CryptoUtil(), new DateUtil());
