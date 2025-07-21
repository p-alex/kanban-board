import { CryptoUtil } from "@kanban/utils";
import BoardCardChecklistItemFactory from "./BoardCardChecklistItemFactory.js";

const boardCardChecklistItemFactory = new BoardCardChecklistItemFactory(
  new CryptoUtil().randomUUID
);

export default boardCardChecklistItemFactory;
