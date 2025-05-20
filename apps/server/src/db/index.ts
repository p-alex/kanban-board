import { PoolClient } from "pg";
import envConfig from "../config.js";
import Database from "./Database.js";

const kanbanDatabase = new Database({
  host: envConfig.DATABASE.HOST,
  user: envConfig.DATABASE.USER,
  database: envConfig.DATABASE.NAME,
  password: envConfig.DATABASE.PASS,
  port: envConfig.DATABASE.PORT,
});

export type QueryDb = <TEntity>(
  text: string,
  params: string[]
) => Promise<TEntity[]>;

export const queryDb: QueryDb = async <TEntity>(
  text: string,
  params: string[]
) => {
  try {
    const client: PoolClient = await kanbanDatabase.getPool().connect();
    const res = await client.query(text, params);
    client.release();
    return res.rows as TEntity[];
  } catch (error: any) {
    throw new Error("Failed to query db: " + error.code);
  }
};

export default kanbanDatabase;
