import { DateUtil } from "@kanban/utils";
import BoardMemberFactory from "./BoardMemberFactory.js";

const boardMemberFactory = new BoardMemberFactory(new DateUtil());

export default boardMemberFactory;
