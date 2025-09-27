import { Router } from "express";
import rateLimiter from "../../middleware/RateLimiter/index.js";
import { TimeConverter } from "@kanban/utils";
import resourceValidator from "../../middleware/ResourceValidator/index.js";
import authDtos from "@kanban/dtos/AuthDtos";
import loginController from "../controllers/auth/LoginController/index.js";
import authShield from "../../middleware/AuthShield/index.js";
import logoutController from "../controllers/auth/LogoutController/index.js";
import refreshSessionController from "../controllers/auth/RefreshSessionController/index.js";
import expressAdapter from "../adapter/ExpressAdapter/index.js";

const authRouter = Router();

const timeConverter = new TimeConverter();

authRouter.post(
  "/login",
  expressAdapter.adapt(
    rateLimiter.limit({
      maxRequests: 812132131,
      windowMs: timeConverter.toMs(15, "minute"),
    })
  ),
  expressAdapter.adapt(
    resourceValidator.validate(authDtos.loginRequestDtoSchema)
  ),
  expressAdapter.adapt(loginController.handle, true)
);

authRouter.post(
  "/logout",
  expressAdapter.adapt(rateLimiter.limit({ maxRequests: 5, windowMs: 1000 })),
  expressAdapter.adapt(authShield.protect({})),
  expressAdapter.adapt(logoutController.handle, true)
);

authRouter.get(
  "/refresh",
  expressAdapter.adapt(rateLimiter.limit({ maxRequests: 5, windowMs: 1000 })),
  expressAdapter.adapt(refreshSessionController.handle, true)
);

authRouter.get(
  "/test",
  expressAdapter.adapt(authShield.protect({})),
  (req, res) => {
    res.json({ hello: "hello" });
  }
);

export default authRouter;
