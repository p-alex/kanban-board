import { queryDb } from "../../../db/index.js";
import SessionRepository from "./SessionRepository.js";

const sessionRepository = new SessionRepository(queryDb);

export default sessionRepository;
