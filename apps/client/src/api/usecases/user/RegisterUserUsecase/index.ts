import { http } from "../../../../utils/BestHttp/index.js";
import RegisterUsecase from "./RegisterUserUsecase.js";

const registerUsecase = new RegisterUsecase(http.send);

export default registerUsecase;
