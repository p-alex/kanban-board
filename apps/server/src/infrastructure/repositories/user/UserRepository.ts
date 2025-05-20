import { QueryDb } from "apps/server/src/db/index.js";
import IUser from "apps/server/src/domain/user/IUser.js";

class UserRepository {
  constructor(private readonly _queryDB: QueryDb) {}

  findByUsername = async (username: string): Promise<IUser | undefined> => {
    const result = await this._queryDB<IUser>(
      "SELECT * FROM users WHERE username=$1",
      [username]
    );

    return result[0];
  };

  findByEmail = async (email: string): Promise<IUser | undefined> => {
    const result = await this._queryDB<IUser>(
      "SELECT * FROM users WHERE email=$1",
      [email]
    );

    return result[0];
  };

  create = async (user: IUser) => {
    const result = await this._queryDB<IUser>(
      "INSERT INTO users (id, username, email, password, created_at) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [user.id, user.username, user.email, user.password, user.created_at]
    );

    return result[0];
  };
}

export default UserRepository;
