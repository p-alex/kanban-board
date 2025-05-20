import HttpClient from "./HttpClient";
import HttpError from "./HttpError";

const httpClient = new HttpClient(import.meta.env.VITE_SERVER_BASE_URL);
const privateHttpClient = new HttpClient(import.meta.env.VITE_SERVER_BASE_URL, {
  credentials: "include",
});

export { httpClient, privateHttpClient, HttpError };
