import userFactory from "../../../../domain/user/index.js";
import userRepository from "../../../../infrastructure/repositories/user/index.js";
import CreateUser from "./CreateUserUsecase.js";

const createUser = new CreateUser(userFactory, userRepository);

export default createUser;
