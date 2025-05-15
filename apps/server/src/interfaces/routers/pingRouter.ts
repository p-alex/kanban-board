import { Router } from "express";
import ExpressAdapter from "../adapter/ExpressAdapter.js";
import PingController from "../controllers/PingController/index.js";

const expressAdapter = new ExpressAdapter();

const pingRouter = Router();

const pingController = new PingController();

pingRouter.get("/ping", expressAdapter.adapt(pingController.ping));

export default pingRouter;
