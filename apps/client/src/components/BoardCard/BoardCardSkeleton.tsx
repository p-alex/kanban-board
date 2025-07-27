function BoardCardSkeleton() {
  return (
    <div className="relative animate-pulse w-full h-[200px] border border-(--ui_border_color_lt) dark:border-(--ui_border_color_dt) bg-(--ui_bg_lt) dark:bg-(--ui_bg_dt)">
      <div className="absolute w-full h-[40px] bg-(--ui_muted_bg_lt) dark:bg-(--ui_muted_bg_dt) bottom-0 left-0"></div>
    </div>
  );
}

export default BoardCardSkeleton;
