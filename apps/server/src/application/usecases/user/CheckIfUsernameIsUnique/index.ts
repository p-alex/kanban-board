import userRepository from "../../../../infrastructure/repositories/user/index.js";
import CheckIfUsernameIsUnique from "./CheckIfUsernameIsUnique.js";

const checkIfUsernameIsUnique = new CheckIfUsernameIsUnique(userRepository);

export default checkIfUsernameIsUnique;
