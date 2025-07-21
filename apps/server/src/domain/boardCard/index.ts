import BoardCardFactory from "./BoardCardFactory.js";
import { CryptoUtil, DateUtil } from "@kanban/utils";

const boardCardFactory = new BoardCardFactory(
  new CryptoUtil().randomUUID,
  new DateUtil().getUtcOfNow
);

export default boardCardFactory;
