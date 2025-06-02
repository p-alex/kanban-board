import cors from "cors";
import helmet from "helmet";
import express from "express";
import envConfig from "./config.js";
import router from "./interfaces/routers/index.js";
import ipRangeCheck from "ip-range-check";

const app = express();

const cloudflareIps = [
  "173.245.48.0/20",
  "103.21.244.0/22",
  "103.22.200.0/22",
  "103.31.4.0/22",
  "141.101.64.0/18",
  "108.162.192.0/18",
  "190.93.240.0/20",
  "188.114.96.0/20",
  "197.234.240.0/22",
  "198.41.128.0/17",
  "162.158.0.0/15",
  "104.16.0.0/13",
  "104.24.0.0/14",
  "172.64.0.0/13",
  "131.0.72.0/22",
];

app.set("trust proxy", (ip: string) => {
  return ipRangeCheck(ip, cloudflareIps);
});
app.use(cors({ origin: envConfig.CLIENT_BASE_URL, credentials: true }));
app.use(express.json());
app.use(helmet());

app.use("/", router);

app.listen(envConfig.PORT, () => {
  console.log("Server started at http://localhost:" + envConfig.PORT);
});
