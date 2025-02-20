import express from "express";
import envConfig from "./config.js";
import router from "./interfaces/routers/index.js";

const app = express();

app.use(express.json());

app.use("/", router);

app.listen(envConfig.PORT, () => {
  console.log("Server started at http://localhost:" + envConfig.PORT);
});
