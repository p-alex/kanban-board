import { PoolClient } from "pg";
import Database from "./Database.js";
import { QueryDb } from "./index.js";

class UnitOfWork {
  constructor(private readonly _db: Database) {}

  start = async () => {
    const pool = this._db.getPool();
    const client = await pool.connect();

    try {
      console.log("Database: Begin transaction...");
      await client.query("BEGIN");
      return {
        query: this.query(client),
        complete: this.complete(client),
        rollback: this.rollback(client),
        release: this.release(client),
      };
    } catch (error) {
      client.release();
      throw error;
    }
  };

  complete = (client: PoolClient) => async () => {
    const result = await client.query("COMMIT");
    console.log("Database: Commiting...");
    return result;
  };

  rollback = (client: PoolClient) => async () => {
    const result = await client.query("ROLLBACK");
    console.log("Database: Rolling back...");
    return result;
  };

  query =
    (client: PoolClient): QueryDb =>
    async <TEntity>(text: string, params: any[]) => {
      const res = await client.query(text, params);
      console.log(text);
      return res.rows as TEntity[];
    };

  release = (client: PoolClient) => () => {
    client.release();
    console.log("Database: Client released!");
  };
}

export default UnitOfWork;
