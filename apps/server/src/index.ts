import express from "express";
import envConfig from "./config.js";

const app = express();

app.listen(envConfig.PORT, () => {
  console.log("Server started at http://localhost:" + envConfig.PORT);
});
