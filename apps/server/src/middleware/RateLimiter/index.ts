import RateLimiter from "./RateLimiter.js";
import { DateUtil } from "@kanban/utils";

const rateLimiter = new RateLimiter(new DateUtil());

export default rateLimiter;
