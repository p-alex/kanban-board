import IUser from "../../domain/user/IUser.js";

export const userFixture: IUser = {
  id: "id",
  username: "username",
  encrypted_email: "encrypted_email",
  hashed_email: "hashed_email",
  password: "password",
  is_verified: false,
  created_at: "created_at",
};
