import BestHttp from "./BestHttp";
import bodyHandler from "./BodyHandler";

export const bestHttp = new BestHttp(bodyHandler);

export const http = bestHttp.create(import.meta.env.VITE_SERVER_BASE_URL);

export const privateHttp = bestHttp.create(
  import.meta.env.VITE_SERVER_BASE_URL
);

export default BestHttp;
