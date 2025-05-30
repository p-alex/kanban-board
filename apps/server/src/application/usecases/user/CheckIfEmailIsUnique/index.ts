import envConfig from "../../../../config.js";
import userRepository from "../../../../infrastructure/repositories/user/index.js";
import CheckIfEmailIsUnique from "./CheckIfEmailIsUnique.js";
import { CryptoUtil } from "@kanban/utils";

const checkIfEmailIsUnique = new CheckIfEmailIsUnique(
  userRepository,
  new CryptoUtil(),
  envConfig.HASH_SECRET.EMAIL
);

export default checkIfEmailIsUnique;
