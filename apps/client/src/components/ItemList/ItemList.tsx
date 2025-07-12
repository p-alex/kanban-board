import { AnimatePresence } from "framer-motion";

interface Props {
  children: React.ReactNode;
  title: string;
  addBtn: React.ReactNode;
}

function ItemList(props: Props) {
  return (
    <div className="flex flex-col gap-2">
      <p className="text-xs text-(--text_muted_lt) dark:text-(--text_muted_dt)">
        {props.title}
      </p>
      <div className="flex flex-col gap-4">
        <ul className="flex flex-col gap-2">
          <AnimatePresence>{props.children}</AnimatePresence>
        </ul>
        {props.addBtn}
      </div>
    </div>
  );
}

export default ItemList;
