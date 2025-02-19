import ServerRouter from "./ServerRouter.js";
import ExpressAdapter from "../adapter/ExpressAdapter.js";
import HealthController from "../controllers/HealthController.js";

const expressAdapter = new ExpressAdapter();

const router = new ServerRouter(expressAdapter);

const healthController = new HealthController();

router.get("/health", healthController.ping);

const healthRouter = router.getRouter();

export default healthRouter;
