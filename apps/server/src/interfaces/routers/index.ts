import { Router } from "express";
import pingRouter from "./pingRouter.js";
import userRouter from "./userRouter.js";
import authRouter from "./authRouter.js";

const router = Router();

router.use("/ping", pingRouter);
router.use("/users", userRouter);
router.use("/auth", authRouter);

export default router;
