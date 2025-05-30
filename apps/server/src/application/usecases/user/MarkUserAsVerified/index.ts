import userRepository from "../../../../infrastructure/repositories/user/index.js";
import MarkUserAsVerified from "./MarkUserAsVerifiedUsecase.js";

const markUserAsVerified = new MarkUserAsVerified(userRepository);

export default markUserAsVerified;
