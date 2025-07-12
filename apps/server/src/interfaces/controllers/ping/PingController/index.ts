import httpResponseFactory from "../../../../HttpResponseFactory/index.js";
import PingController from "./PingController.js";

const pingController = new PingController(httpResponseFactory);

export default pingController;
