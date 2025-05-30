import envConfig from "../../config.js";
import UserFactory from "./UserFactory.js";
import { CryptoUtil, DateUtil } from "@kanban/utils";

const userFactory = new UserFactory(
  new CryptoUtil(),
  new DateUtil(),
  envConfig.ENCRYPTION_SECRET.EMAIL,
  envConfig.HASH_SECRET.EMAIL,
  envConfig.SALT_ROUNDS.PASSWORD
);

export default userFactory;
