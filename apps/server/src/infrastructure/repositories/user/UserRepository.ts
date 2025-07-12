import { QueryDb } from "../../../db/index.js";
import IUser from "../../../domain/user/IUser.js";
import { RepositoryOptions } from "../index.js";

class UserRepository {
  constructor(private readonly _queryDB: QueryDb) {}

  findById = async (
    id: string,
    options?: RepositoryOptions
  ): Promise<IUser | undefined> => {
    const queryFunc = this.getQueryFunction(options);

    const result = await queryFunc<IUser>("SELECT * FROM users WHERE id=$1", [
      id,
    ]);

    return result[0];
  };

  findByUsername = async (
    username: string,
    options?: RepositoryOptions
  ): Promise<IUser | undefined> => {
    const queryFunc = this.getQueryFunction(options);

    const result = await queryFunc<IUser>(
      "SELECT * FROM users WHERE username=$1",
      [username]
    );

    return result[0];
  };

  findByEmail = async (
    hashedEmail: string,
    options?: RepositoryOptions
  ): Promise<IUser | undefined> => {
    const queryFunc = this.getQueryFunction(options);

    const result = await queryFunc<IUser>(
      "SELECT * FROM users WHERE hashed_email=$1",
      [hashedEmail]
    );

    return result[0];
  };

  create = async (user: IUser, options?: RepositoryOptions) => {
    const queryFunc = this.getQueryFunction(options);

    const result = await queryFunc<IUser>(
      "INSERT INTO users (id, username, encrypted_email, hashed_email, password, created_at) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
      [
        user.id,
        user.username,
        user.encrypted_email,
        user.hashed_email,
        user.password,
        user.created_at,
      ]
    );

    return result[0];
  };

  update = async (user: IUser, options?: RepositoryOptions) => {
    const queryFunc = this.getQueryFunction(options);

    const result = await queryFunc<IUser>(
      "UPDATE users SET username = $1, encrypted_email = $2, hashed_email = $3, password = $4, is_verified = $5 WHERE users.id = $6 RETURNING *",
      [
        user.username,
        user.encrypted_email,
        user.hashed_email,
        user.password,
        `${user.is_verified}`,
        user.id,
      ]
    );

    return result[0];
  };

  deleteById = async (id: string, options?: RepositoryOptions) => {
    const queryFunc = this.getQueryFunction(options);

    const result = await queryFunc<IUser>(
      "DELETE FROM users WHERE id = $1 RETURNING *",
      [id]
    );

    return result[0];
  };

  private getQueryFunction = (options?: RepositoryOptions) => {
    return options?.transactionQuery !== undefined
      ? options.transactionQuery
      : this._queryDB;
  };
}

export default UserRepository;
