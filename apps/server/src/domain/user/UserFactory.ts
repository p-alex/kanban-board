import IUser from "./IUser.js";
import { CryptoUtil, DateUtil } from "@kanban/utils";

export type UserFactoryData = Pick<IUser, "username" | "email" | "password">;

class UserFactory {
  constructor(
    private readonly _crypto: CryptoUtil,
    private readonly _date: DateUtil,
    private readonly _emailSecret: string,
    private readonly _passwordSaltRounds: number
  ) {}

  async create(userData: UserFactoryData): Promise<IUser> {
    return {
      id: this._crypto.randomUUID(),
      username: userData.username,
      email: this._crypto.encrypt(userData.email, this._emailSecret),
      password: await this._crypto.slowHash(
        userData.password,
        this._passwordSaltRounds
      ),
      created_at: this._date.getUtcOfNow(),
    };
  }
}

export default UserFactory;
