import { QueryDb } from "../../../db/index.js";
import IVerificationCode from "../../../domain/verificationCode/IVerificationCode.js";
import { RepositoryOptions } from "../index.js";

class VerificationCodeRepository {
  constructor(private readonly _queryDB: QueryDb) {}

  findByCode = async (
    hashedCode: string,
    options?: RepositoryOptions
  ): Promise<IVerificationCode | undefined> => {
    const queryFunc = this.getQueryFunction(options);

    const result = await queryFunc<IVerificationCode>(
      "SELECT * FROM verification_codes WHERE code = $1",
      [hashedCode]
    );
    return result[0];
  };

  create = async (
    verificationCode: IVerificationCode,
    options?: RepositoryOptions
  ) => {
    const queryFunc = this.getQueryFunction(options);

    const result = await queryFunc<IVerificationCode>(
      "INSERT INTO verification_codes (id, user_id, code, type, created_at, expires_at) VALUES ($1,$2,$3,$4,$5,$6) RETURNING *",
      [
        verificationCode.id,
        verificationCode.user_id,
        verificationCode.code,
        verificationCode.type,
        verificationCode.created_at,
        verificationCode.expires_at,
      ]
    );
    return result[0];
  };

  deleteByCode = async (code: string, options?: RepositoryOptions) => {
    const queryFunc = this.getQueryFunction(options);

    const result = await queryFunc<IVerificationCode>(
      "DELETE FROM verification_codes WHERE code = $1 RETURNING *",
      [code]
    );

    return result[0];
  };

  deleteById = async (id: string, options?: RepositoryOptions) => {
    const queryFunc = this.getQueryFunction(options);

    const result = await queryFunc<IVerificationCode>(
      "DELETE FROM verification_codes WHERE id = $1 RETURNING *",
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

export default VerificationCodeRepository;
