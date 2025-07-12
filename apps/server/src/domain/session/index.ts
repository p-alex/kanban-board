import envConfig from "../../config.js";
import ISession from "./ISession.js";
import SessionFactory from "./SessionFactory.js";
import { CryptoUtil, DateUtil, TimeConverter } from "@kanban/utils";

export const SESSION_EXPIRE_TIME_IN_MS = new TimeConverter().toMs(30, "day");

export const sessionMock: ISession = {
  id: "id",
  user_id: "user_id",
  token: "token",
  created_at: "created_at",
  expires_at: "expires_at",
  last_accessed_at: "last_accessed_at",
};

const sessionFactory = new SessionFactory(
  new CryptoUtil(),
  new DateUtil(),
  envConfig.HASH_SECRET.SESSION,
  SESSION_EXPIRE_TIME_IN_MS
);

export default sessionFactory;
