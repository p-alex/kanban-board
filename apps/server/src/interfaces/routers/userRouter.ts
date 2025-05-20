import ExpressAdapter from "../adapter/ExpressAdapter.js";
import userController from "../controllers/UserController/index.js";
import validateResource from "../../middleware/validateResource.js";
import { createUserRequestDtoSchema } from "@kanban/dtos/UserDtos";
import { Router } from "express";

const expressAdapter = new ExpressAdapter();

const userRouter = Router();

userRouter.post(
  "/",
  validateResource(createUserRequestDtoSchema),
  expressAdapter.adapt(userController.create)
);

export default userRouter;
