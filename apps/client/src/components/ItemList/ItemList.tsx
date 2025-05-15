import { AnimatePresence } from "framer-motion";

interface Props {
  children: React.ReactNode;
  title: string;
  addBtn: React.ReactNode;
}

function ItemList(props: Props) {
  return (
    <div className="flex flex-col gap-2">
      <p className="text-xs font-bold text-(--textMutedLightTheme) dark:text-(--textDarkTheme)">
        Columns
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
