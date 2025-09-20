import z from "zod";

export const boardMemberRoles = ["admin", "member", "viewer", "guest"] as const;

export const idSchema = z.string().uuid();
