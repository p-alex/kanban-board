import BoardFactory from "./BoardFactory.js";
import { DateUtil, CryptoUtil } from "@kanban/utils";

const boardFactory = new BoardFactory(
  new CryptoUtil().randomUUID,
  new DateUtil().getUtcOfNow
);

export default boardFactory;
