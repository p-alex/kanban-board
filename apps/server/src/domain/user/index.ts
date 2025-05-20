import envConfig from "../../config.js";
import UserFactory from "./UserFactory.js";
import { CryptoUtil, DateUtil } from "@kanban/utils";

const userFactory = new UserFactory(
  new CryptoUtil(),
  new DateUtil(),
  envConfig.EMAIL_ENCRYPTION_SECRET,
  envConfig.PASSWORD_SALT_ROUNDS
);

export default userFactory;
