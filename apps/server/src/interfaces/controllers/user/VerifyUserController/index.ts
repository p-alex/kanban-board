import verifyUserService from "../../../../application/services/user/VerifiyUserService/index.js";
import VerifyUserController from "./VerifyUserController.js";

const verifyUserController = new VerifyUserController(verifyUserService);

export default verifyUserController;
