import { Router } from "express";
import {
  createUserRequestDtoSchema,
  verifyUserRequestDto,
} from "@kanban/dtos/UserDtos";
import createUserController from "../controllers/user/CreateUserController/index.js";
import verifyUserController from "../controllers/user/VerifyUserController/index.js";
import rateLimiter from "../../middleware/RateLimiter/index.js";
import { TimeConverter } from "@kanban/utils";
import resourceValidator from "../../middleware/ResourceValidator/index.js";
import expressAdapter from "../adapter/ExpressAdapter/index.js";

const userRouter = Router();

const timeConverter = new TimeConverter();

userRouter.post(
  "/",
  expressAdapter.adapt(
    rateLimiter.limit({
      maxRequests: 5,
      windowMs: timeConverter.toMs(15, "minute"),
    })
  ),
  expressAdapter.adapt(resourceValidator.validate(createUserRequestDtoSchema)),
  expressAdapter.adapt(createUserController.handle, true)
);

userRouter.post(
  "/verify",
  expressAdapter.adapt(
    rateLimiter.limit({
      maxRequests: 5,
      windowMs: timeConverter.toMs(15, "minute"),
    })
  ),
  expressAdapter.adapt(resourceValidator.validate(verifyUserRequestDto)),
  expressAdapter.adapt(verifyUserController.handle, true)
);

export default userRouter;
