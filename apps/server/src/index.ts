import cors from "cors";
import helmet from "helmet";
import express from "express";
import envConfig from "./config.js";
import router from "./interfaces/routers/index.js";

const app = express();

app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());
app.use(helmet());

app.use("/", router);

app.listen(envConfig.PORT, () => {
  console.log("Server started at http://localhost:" + envConfig.PORT);
});
