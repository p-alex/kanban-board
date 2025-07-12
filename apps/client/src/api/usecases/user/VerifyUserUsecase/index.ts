import { http } from "../../../../utils/BestHttp";
import VerifyUserUsecase from "./VerifyUserUsecase";

const verifyUserUsecase = new VerifyUserUsecase(http);

export default verifyUserUsecase;
