import { queryDb } from "../../../db/index.js";
import BoardMemberRepository from "./BoardMemberRepository.js";

const boardMemberRepository = new BoardMemberRepository(queryDb);

export default boardMemberRepository;
