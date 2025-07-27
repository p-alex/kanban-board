import { Router } from "express";
import rateLimiter from "../../middleware/RateLimiter/index.js";
import { TimeConverter } from "@kanban/utils";
import resourceValidator from "../../middleware/ResourceValidator/index.js";
import boardDtos from "@kanban/dtos/BoardDtos";
import expressAdapter from "../adapter/ExpressAdapter/index.js";
import createBoardController from "../controllers/board/CreateBoardController/index.js";
import authShield from "../../middleware/AuthShield/index.js";
import getBoardsController from "../controllers/board/GetBoardsController/index.js";

const boardRouter = Router();

const timeConverter = new TimeConverter();

boardRouter.get(
  "/",
  expressAdapter.adapt(
    rateLimiter.limit({
      maxRequests: 10,
      windowMs: timeConverter.toMs(1, "second"),
    })
  ),
  expressAdapter.adapt(authShield.protect),
  expressAdapter.adapt(getBoardsController.handle, true)
);

boardRouter.post(
  "/",
  expressAdapter.adapt(
    rateLimiter.limit({
      maxRequests: 1,
      windowMs: timeConverter.toMs(1, "second"),
    })
  ),
  expressAdapter.adapt(
    resourceValidator.validate(boardDtos.createBoardRequestDto)
  ),
  expressAdapter.adapt(createBoardController.handle, true)
);

export default boardRouter;
