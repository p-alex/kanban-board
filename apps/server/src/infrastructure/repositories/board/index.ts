import { queryDb } from "../../../db/index.js";
import BoardRepository from "./BoardRepository.js";

const boardRepository = new BoardRepository(queryDb);

export default boardRepository;
