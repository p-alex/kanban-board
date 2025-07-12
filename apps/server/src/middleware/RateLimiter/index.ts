import httpResponseFactory from "../../HttpResponseFactory/index.js";
import RateLimiter from "./RateLimiter.js";
import { DateUtil } from "@kanban/utils";

const rateLimiter = new RateLimiter(new DateUtil(), httpResponseFactory);

export default rateLimiter;
