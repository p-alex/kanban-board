import pg, { PoolClient } from "pg";

export type DatabaseConfig = {
  user: string;
  host: string;
  password: string;
  port: number;
  database: string;
};

class Database {
  private readonly _pool: pg.Pool;

  constructor(private readonly _databaseConfig: DatabaseConfig) {
    this._databaseConfig = _databaseConfig;
    this._pool = new pg.Pool(this._databaseConfig);
  }

  endPool = async () => {
    await this._pool.end();
  };

  getPool = () => {
    return this._pool;
  };

  ping = async () => {
    let client: PoolClient | null = null;
    try {
      client = await this._pool.connect();
      await client.query("SELECT 1");
    } catch (error: any) {
      console.log("Failed to ping database");
    } finally {
      console.log("Pinged db to wake up");
      if (client) client.release();
    }
  };
}

export default Database;
