import { queryDb } from "../../../db/index.js";
import VerificationCodeRepository from "./VerificationCodeRepository.js";

const verificationCodeRepository = new VerificationCodeRepository(queryDb);

export default verificationCodeRepository;
