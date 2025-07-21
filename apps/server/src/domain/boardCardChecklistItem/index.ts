import { CryptoUtil, DateUtil } from "@kanban/utils";
import BoardCardChecklistItemFactory from "./BoardCardChecklistItemFactory.js";

const boardCardChecklistItemFactory = new BoardCardChecklistItemFactory(
  new CryptoUtil().randomUUID,
  new DateUtil().getUtcOfNow
);

export default boardCardChecklistItemFactory;
