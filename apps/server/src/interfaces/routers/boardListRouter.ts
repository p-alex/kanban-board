import { Router } from "express";
import expressAdapter from "../adapter/ExpressAdapter/index.js";
import rateLimiter from "../../middleware/RateLimiter/index.js";
import authShield from "../../middleware/AuthShield/index.js";
import resourceValidator from "../../middleware/ResourceValidator/index.js";
import {
  createBoardListRequestDto,
  getBoardListsRequestDto,
} from "@kanban/dtos/BoardListDtos";
import createBoardCardListController from "../controllers/boardList/CreateBoardListController/index.js";
import getBoardListsController from "../controllers/boardList/GetBoardListsController/index.js";

const boardListRouter = Router();

boardListRouter.get(
  "/:board_id",
  expressAdapter.adapt(rateLimiter.limit({ maxRequests: 5, windowMs: 1000 })),
  expressAdapter.adapt(authShield.protect({ letThroughAnyway: true })),
  expressAdapter.adapt(resourceValidator.validate(getBoardListsRequestDto)),
  expressAdapter.adapt(getBoardListsController.handle, true)
);

boardListRouter.post(
  "/",
  expressAdapter.adapt(rateLimiter.limit({ maxRequests: 5, windowMs: 1000 })),
  expressAdapter.adapt(authShield.protect({})),
  expressAdapter.adapt(resourceValidator.validate(createBoardListRequestDto)),
  expressAdapter.adapt(createBoardCardListController.handle, true)
);

export default boardListRouter;
