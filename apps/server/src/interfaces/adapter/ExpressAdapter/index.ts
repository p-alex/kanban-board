import httpResponseFactory from "../../../HttpResponseFactory/index.js";
import ExpressAdapter from "./ExpressAdapter.js";

const expressAdapter = new ExpressAdapter(httpResponseFactory);

export default expressAdapter;
