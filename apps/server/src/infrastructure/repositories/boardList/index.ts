import { queryDb } from "../../../db/index.js";
import BoardListRepository from "./BoardListRepository.js";

const boardListRepository = new BoardListRepository(queryDb);

export default boardListRepository;
