import { CryptoUtil, DateUtil } from "@kanban/utils";
import BoardColumnFactory from "./BoardListFactory.js";

const boardColumnFactory = new BoardColumnFactory(
  new CryptoUtil().randomUUID,
  new DateUtil().getUtcOfNow
);

export default boardColumnFactory;
