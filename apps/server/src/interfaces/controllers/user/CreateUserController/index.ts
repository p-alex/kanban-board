import createUserService from "../../../../application/services/user/CreateUserService/index.js";
import CreateUserController from "./CreateUserController.js";

const createUserController = new CreateUserController(createUserService);

export default createUserController;
