import express from "express";
import envConfig from "./config.js";
import healthRouter from "./interfaces/routers/healthRouter.js";

const app = express();

app.use(express.json());

app.use("/", healthRouter);

app.listen(envConfig.PORT, () => {
  console.log("Server started at http://localhost:" + envConfig.PORT);
});
