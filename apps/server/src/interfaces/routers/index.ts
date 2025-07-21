import { Router } from "express";
import pingRouter from "./pingRouter.js";
import userRouter from "./userRouter.js";
import authRouter from "./authRouter.js";
import boardRouter from "./boardRouter.js";

const router = Router();

router.use("/ping", pingRouter);
router.use("/users", userRouter);
router.use("/auth", authRouter);
router.use("/boards", boardRouter);

export default router;
