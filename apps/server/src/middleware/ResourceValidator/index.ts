import httpResponseFactory from "../../HttpResponseFactory/index.js";
import ResourceValidator from "./ResourceValidator.js";

const resourceValidator = new ResourceValidator(httpResponseFactory);

export default resourceValidator;
