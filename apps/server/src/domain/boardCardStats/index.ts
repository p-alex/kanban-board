import { CryptoUtil } from "@kanban/utils";
import BoardCardStatsFactory from "./BoardCardStatsFactory.js";

const boardCardStatsFactory = new BoardCardStatsFactory(
  new CryptoUtil().randomUUID
);

export default boardCardStatsFactory;
