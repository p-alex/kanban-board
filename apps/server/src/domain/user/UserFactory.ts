import IUser from "./IUser.js";
import { CryptoUtil, DateUtil } from "@kanban/utils";

export type UserFactoryData = {
  username: string;
  email: string;
  password: string;
};

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
      encrypted_email: this._crypto.encrypt(userData.email, this._emailSecret),
      hashed_email: this._crypto.sha256(userData.email),
      password: await this._crypto.slowHash(
        userData.password,
        this._passwordSaltRounds
      ),
      is_verified: false,
      created_at: this._date.getUtcOfNow(),
    };
  }
}

export default UserFactory;
