import { Router } from "express";
import {
  createUserRequestDtoSchema,
  verifyUserRequestDto,
} from "@kanban/dtos/UserDtos";
import createUserController from "../controllers/user/CreateUserController/index.js";
import verifyUserController from "../controllers/user/VerifyUserController/index.js";
import rateLimiter from "../../middleware/RateLimiter/index.js";
import { TimeConverter } from "@kanban/utils";
import expressAdapter from "../adapter/ExpressAdapter/index.js";
import ExpressMiddlewareAdapter from "../adapter/ExpressMiddlewareAdapter/ExpressMiddlewareAdapter.js";
import resourceValidator from "../../middleware/ResourceValidator/index.js";

const expressMiddlewareAdapter = new ExpressMiddlewareAdapter();

const userRouter = Router();

userRouter.post(
  "/",
  expressMiddlewareAdapter.adapt(
    rateLimiter.limit({
      maxRequests: 5,
      windowMs: new TimeConverter().toMs(15, "minute"),
    })
  ),
  expressMiddlewareAdapter.adapt(
    resourceValidator.validate(createUserRequestDtoSchema)
  ),
  expressAdapter.adapt(createUserController.handle)
);

userRouter.post(
  "/verify",
  expressMiddlewareAdapter.adapt(
    rateLimiter.limit({
      maxRequests: 5,
      windowMs: new TimeConverter().toMs(15, "minute"),
    })
  ),
  expressMiddlewareAdapter.adapt(
    resourceValidator.validate(verifyUserRequestDto)
  ),
  expressAdapter.adapt(verifyUserController.handle)
);

export default userRouter;
