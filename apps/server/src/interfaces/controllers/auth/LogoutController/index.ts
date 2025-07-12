import logoutService from "../../../../application/services/auth/LogoutService/index.js";
import httpResponseFactory from "../../../../HttpResponseFactory/index.js";
import LogoutController from "./LogoutController.js";

const logoutController = new LogoutController(
  logoutService,
  httpResponseFactory
);

export default logoutController;
