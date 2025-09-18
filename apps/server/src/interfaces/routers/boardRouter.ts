import { Router } from "express";
import rateLimiter from "../../middleware/RateLimiter/index.js";
import { TimeConverter } from "@kanban/utils";
import resourceValidator from "../../middleware/ResourceValidator/index.js";
import boardDtos from "@kanban/dtos/BoardDtos";
import expressAdapter from "../adapter/ExpressAdapter/index.js";
import createBoardController from "../controllers/board/CreateBoardController/index.js";
import authShield from "../../middleware/AuthShield/index.js";
import getBoardsController from "../controllers/board/GetBoardsController/index.js";
import updateBoardController from "../controllers/board/UpdateBoardController/index.js";
import getBoardController from "../controllers/board/GetBoardController/index.js";
import markBoardAsFavoriteController from "../controllers/board/MarkBoardAsFavoriteController/index.js";
import unmarkBoardAsFavoriteController from "../controllers/board/UnmarkBoardAsFavoriteController/index.js";
import { getBoardRequestDtoSchema } from "../../../../../packages/dtos/dist/board/schemas/getBoard.schema.js";
import getPublicBoardController from "../controllers/board/GetPublicBoardController/index.js";
import { getPublicBoardRequestDto } from "../../../../../packages/dtos/dist/board/schemas/getPublicBoard.schema.js";

const boardRouter = Router();

boardRouter.get(
  "/",
  expressAdapter.adapt(rateLimiter.limit({ maxRequests: 10, windowMs: 1000 })),
  expressAdapter.adapt(authShield.protect),
  expressAdapter.adapt(getBoardsController.handle, true)
);

boardRouter.get(
  "/:id",
  expressAdapter.adapt(rateLimiter.limit({ maxRequests: 10, windowMs: 1000 })),
  expressAdapter.adapt(authShield.protect),
  expressAdapter.adapt(resourceValidator.validate(getBoardRequestDtoSchema)),
  expressAdapter.adapt(getBoardController.handle, true)
);

boardRouter.get(
  "/:id/public",
  expressAdapter.adapt(rateLimiter.limit({ maxRequests: 10, windowMs: 1000 })),
  expressAdapter.adapt(resourceValidator.validate(getPublicBoardRequestDto)),
  expressAdapter.adapt(getPublicBoardController.handle, true)
);

boardRouter.post(
  "/",
  expressAdapter.adapt(rateLimiter.limit({ maxRequests: 5, windowMs: 1000 })),
  expressAdapter.adapt(authShield.protect),
  expressAdapter.adapt(
    resourceValidator.validate(boardDtos.createBoardRequestDto)
  ),
  expressAdapter.adapt(createBoardController.handle, true)
);

boardRouter.put(
  "/",
  expressAdapter.adapt(rateLimiter.limit({ maxRequests: 5, windowMs: 1000 })),
  expressAdapter.adapt(authShield.protect),
  expressAdapter.adapt(
    resourceValidator.validate(boardDtos.updateBoardRequestDto)
  ),
  expressAdapter.adapt(updateBoardController.handle, true)
);

boardRouter.post(
  "/:board_id/mark-favorite",
  expressAdapter.adapt(rateLimiter.limit({ maxRequests: 5, windowMs: 1000 })),
  expressAdapter.adapt(authShield.protect),
  expressAdapter.adapt(markBoardAsFavoriteController.handle, true)
);

boardRouter.post(
  "/:board_id/unmark-favorite",
  expressAdapter.adapt(rateLimiter.limit({ maxRequests: 5, windowMs: 1000 })),
  expressAdapter.adapt(authShield.protect),
  expressAdapter.adapt(unmarkBoardAsFavoriteController.handle, true)
);

export default boardRouter;
