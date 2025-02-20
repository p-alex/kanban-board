import { Router } from "express";
import pingRouter from "./pingRouter.js";

const router = Router();

router.use("/", pingRouter);

export default router;
