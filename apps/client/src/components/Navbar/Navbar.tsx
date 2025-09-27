import { Link } from "react-router-dom";
import { IUser } from "../../api/domain/IUser";
import useAuthContext from "../../hooks/useAuthContext/useAuthContext";
import BigLogo from "../BigLogo/BigLogo";
import Button from "../Button/Button";
import CreateBoardForm from "../Forms/CreateBoardForm/CreateBoardForm";
import Modal from "../Modal/Modal";
import PrimaryButton from "../PrimaryButton";
import VisibilityProvider from "../VisibilityProvider";

interface Props {
  logout: Function;
  user: IUser;
}

function Navbar(props: Props) {
  const auth = useAuthContext();

  return (
    <div className="w-full bg-(--ui_bg_lt) dark:bg-(--ui_bg_dt) py-3 px-4 text-sm flex justify-between gap-4 items-center h-(--navbar_height) border-b border-b-(--ui_border_color_lt) dark:border-b-(--ui_border_color_dt)">
      <div className="flex-1">
        <BigLogo />
      </div>
      <div className="flex flex-1 justify-center">
        {auth.isLoggedIn && (
          <VisibilityProvider
            toggle={({ toggleVisibility }) => (
              <PrimaryButton className="w-max" onClick={toggleVisibility}>
                Create Board
              </PrimaryButton>
            )}
            content={(visibilityContentProps) => (
              <Modal
                content={(modalProps) => (
                  <CreateBoardForm
                    modalProps={modalProps}
                    callback={() => visibilityContentProps.toggleVisibility()}
                  />
                )}
                toggleOff={visibilityContentProps.toggleVisibility}
              />
            )}
            options={{ shouldTrapFocus: true }}
          />
        )}
      </div>
      <div className="flex-1 justify-end">
        <div className="flex items-center gap-2 flex-1 justify-end">
          {auth.isLoggedIn && (
            <>
              <p className="capitalize">Welcome, {props.user.username}!</p>
              <Button
                onClick={() => props.logout()}
                className="cursor-pointer w-max"
              >
                Logout
              </Button>
            </>
          )}
          {!auth.isLoggedIn && (
            <Link to="/login">
              <Button type="button" className="cursor-pointer w-max">
                Login
              </Button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

export default Navbar;
