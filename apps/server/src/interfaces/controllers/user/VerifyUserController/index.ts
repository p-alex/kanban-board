import verifyUserService from "../../../../application/services/user/VerifiyUserService/index.js";
import httpResponseFactory from "../../../../HttpResponseFactory/index.js";
import VerifyUserController from "./VerifyUserController.js";

const verifyUserController = new VerifyUserController(
  verifyUserService,
  httpResponseFactory
);

export default verifyUserController;
