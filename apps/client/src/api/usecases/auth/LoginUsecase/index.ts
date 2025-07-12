import { http } from "../../../../utils/BestHttp";
import dtoToUser from "../../../dtoTransformers/dtoToUser";
import LoginUsecase from "./LoginUsecase";

const loginUsecase = new LoginUsecase(http.send, dtoToUser);

export default loginUsecase;
