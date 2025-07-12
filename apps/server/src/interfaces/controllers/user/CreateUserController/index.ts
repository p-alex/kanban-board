import createUserService from "../../../../application/services/user/CreateUserService/index.js";
import httpResponseFactory from "../../../../HttpResponseFactory/index.js";
import CreateUserController from "./CreateUserController.js";

const createUserController = new CreateUserController(
  createUserService,
  httpResponseFactory
);

export default createUserController;
