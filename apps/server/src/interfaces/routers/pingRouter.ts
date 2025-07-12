import { Router } from "express";
import expressAdapter from "../adapter/ExpressAdapter/index.js";
import rateLimiter from "../../middleware/RateLimiter/index.js";
import { TimeConverter } from "@kanban/utils";
import pingController from "../controllers/ping/PingController/index.js";

const pingRouter = Router();

const timeConverter = new TimeConverter();

pingRouter.get(
  "",
  expressAdapter.adapt(
    rateLimiter.limit({
      maxRequests: 5,
      windowMs: timeConverter.toMs(30, "second"),
    })
  ),
  expressAdapter.adapt(pingController.handle, true)
);

export default pingRouter;
