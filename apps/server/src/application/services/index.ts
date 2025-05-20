import userRepository from "../../infrastructure/repositories/user/index.js";
import UserService from "./UserService.js";
import userFactory from "../../domain/user/index.js";

const userService = new UserService(userRepository, userFactory);

export default userService;
