import { http } from "../../../../utils/BestHttp";
import dtoToUser from "../../../dtoTransformers/dtoToUser";
import RefreshSessionUsecase from "./RefreshSessionUsecase";

const refreshSessionUsecase = new RefreshSessionUsecase(http.send, dtoToUser);

export default refreshSessionUsecase;
