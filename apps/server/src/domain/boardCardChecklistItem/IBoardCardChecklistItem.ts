interface IBoardCardChecklistItem {
  id: string;
  board_checklist_id: string;
  title: string;
  is_done: boolean;
  index: number;
  created_at: string;
}

export default IBoardCardChecklistItem;
