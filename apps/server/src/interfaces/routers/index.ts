import { Router } from "express";
import pingRouter from "./pingRouter.js";
import userRouter from "./userRouter.js";

const router = Router();

router.use("/ping", pingRouter);
router.use("/users", userRouter);

export default router;
