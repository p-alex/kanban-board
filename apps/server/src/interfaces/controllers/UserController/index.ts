import userService from "../../../application/services/user/index.js";
import UserController from "./UserController.js";

const userController = new UserController(userService);

export default userController;
