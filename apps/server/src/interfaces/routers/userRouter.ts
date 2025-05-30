import ExpressAdapter from "../adapter/ExpressAdapter.js";
import validateResource from "../../middleware/validateResource.js";
import { createUserRequestDtoSchema } from "@kanban/dtos/UserDtos";
import { Router } from "express";
import { verifyUserRequestDto } from "@kanban/dtos/UserDtos";
import createUserController from "../controllers/user/CreateUserController/index.js";
import verifyUserController from "../controllers/user/VerifyUserController/index.js";

const expressAdapter = new ExpressAdapter();

const userRouter = Router();

userRouter.post(
  "/",
  validateResource(createUserRequestDtoSchema),
  expressAdapter.adapt(createUserController.handle)
);

userRouter.post(
  "/verify",
  validateResource(verifyUserRequestDto),
  expressAdapter.adapt(verifyUserController.handle)
);

export default userRouter;
