import { Router } from "express";
import PingController from "../controllers/PingController/index.js";
import expressAdapter from "../adapter/ExpressAdapter/index.js";
import expressMiddlewareAdapter from "../adapter/ExpressMiddlewareAdapter/index.js";
import rateLimiter from "../../middleware/RateLimiter/index.js";
import { TimeConverter } from "@kanban/utils";

const pingRouter = Router();

const pingController = new PingController();

pingRouter.get(
  "/",
  expressMiddlewareAdapter.adapt(
    rateLimiter.limit({
      maxRequests: 5,
      windowMs: new TimeConverter().toMs(30, "second"),
    })
  ),
  expressAdapter.adapt(pingController.ping)
);

export default pingRouter;
