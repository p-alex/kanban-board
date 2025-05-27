import { PoolClient } from "pg";
import envConfig from "../config.js";
import Database from "./Database.js";

const kanbanDatabase = new Database({
  host: envConfig.DATABASE_CONFIG.HOST,
  user: envConfig.DATABASE_CONFIG.USER,
  database: envConfig.DATABASE_CONFIG.NAME,
  password: envConfig.DATABASE_CONFIG.PASS,
  port: envConfig.DATABASE_CONFIG.PORT,
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
    console.error(error);
    throw new Error("Failed to query db: " + error.code);
  }
};

export default kanbanDatabase;
