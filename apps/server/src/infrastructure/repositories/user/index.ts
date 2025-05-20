import { queryDb } from "../../../db/index.js";
import UserRepository from "./UserRepository.js";

const userRepository = new UserRepository(queryDb);

export default userRepository;
