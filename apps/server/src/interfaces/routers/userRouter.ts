import ExpressAdapter from "../adapter/ExpressAdapter.js";
import userController from "../controllers/UserController/index.js";
import validateResource from "../../middleware/validateResource.js";
import { createUserRequestDtoSchema } from "@kanban/dtos/UserDtos";
import { Router } from "express";
import { emailVerificationRequestDto } from "@kanban/dtos/VerificationCodeDto";

const expressAdapter = new ExpressAdapter();

const userRouter = Router();

userRouter.post(
  "/",
  validateResource(createUserRequestDtoSchema),
  expressAdapter.adapt(userController.create)
);

userRouter.post(
  "/verify-email",
  validateResource(emailVerificationRequestDto),
  expressAdapter.adapt(userController.verifyEmail)
);

export default userRouter;
