import { CryptoUtil, DateUtil } from "@kanban/utils";
import BoardCardChecklistFactory from "./BoardCardChecklistFactory.js";

const boardCardChecklistFactory = new BoardCardChecklistFactory(
  new CryptoUtil()["randomUUID"],
  new DateUtil()["getUtcOfNow"]
);

export default boardCardChecklistFactory;
