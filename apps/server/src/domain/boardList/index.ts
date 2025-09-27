import { CryptoUtil, DateUtil } from "@kanban/utils";
import BoardListFactory from "./BoardListFactory.js";

const boardListFactory = new BoardListFactory(
  new CryptoUtil().randomUUID,
  new DateUtil().getUtcOfNow
);

export default boardListFactory;
