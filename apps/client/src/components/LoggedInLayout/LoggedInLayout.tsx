import { useEffect, useState } from "react";
import useLocalStorage from "../../hooks/useLocalStorage/useLocalStorage";
import SideBar from "../SideBar";
import { ShowIcon } from "../../icons";

interface Props {
  children?: React.ReactNode;
}

function LoggedInLayout(props: Props) {
  const localStorage = useLocalStorage();

  const [isSideBarOpen, setIsSideBarOpen] = useState(false);

  const toggleSideBar = () => {
    setIsSideBarOpen((prev) => {
      const nextValue = !prev;
      localStorage.set("isSideBarOpen", nextValue);
      return nextValue;
    });
  };

  const setup = () => {
    const isSideBarOpen = localStorage.get("isSideBarOpen");
    if (isSideBarOpen === null) {
      setIsSideBarOpen(() => {
        localStorage.set("isSideBarOpen", true);
        return true;
      });
    } else {
      const initialIsSideBarOpen = localStorage.get<boolean>("isSideBarOpen")!;
      setIsSideBarOpen(initialIsSideBarOpen);
    }
  };

  useEffect(() => {
    setup();
  }, []);

  return (
    <div className="flex justify-end">
      {isSideBarOpen && <SideBar toggleSideBar={toggleSideBar} />}

      {!isSideBarOpen && (
        <button
          data-testid="showSideBarButton"
          onClick={toggleSideBar}
          className="flex left-0 items-center justify-center w-14 h-12 rounded-tr-full rounded-br-full bg-(--primaryColor) text-white fixed bottom-8 cursor-pointer z-100"
          title="show sidebar"
        >
          <ShowIcon className="mr-1" />
        </button>
      )}

      <div
        style={{
          width: `${isSideBarOpen ? "calc(100% - 300px)" : "100%"}`,
        }}
      >
        {props.children}
      </div>
    </div>
  );
}

export default LoggedInLayout;
