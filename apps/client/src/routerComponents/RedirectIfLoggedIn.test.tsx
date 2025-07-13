import { Mock } from "vitest";
import useAuthContext from "../hooks/useAuthContext/useAuthContext";
import { useLocation, useNavigate } from "react-router-dom";
import { render, screen } from "@testing-library/react";
import RedirectIfLoggedIn from "./RedirectIfLoggedIn";

vi.mock("../hooks/useAuthContext/useAuthContext");
vi.mock("react-router-dom");

describe("RedirectIfLoggedIn.tsx", () => {
  let navigateMock: Mock;

  beforeEach(() => {
    navigateMock = vi.fn();

    (useAuthContext as Mock).mockReturnValue({
      isLoggedIn: true,
    });

    (useNavigate as Mock).mockReturnValue(navigateMock);
    (useLocation as Mock).mockReturnValue({ state: undefined });
  });

  it("should redirect to '/' by default if the user is logged in and prev location is not present in location state", () => {
    render(<RedirectIfLoggedIn>child</RedirectIfLoggedIn>);

    expect(navigateMock).toHaveBeenCalledWith("/");
  });

  it("should redirect to previous location if the user is logged in and prev location is present in location state", () => {
    (useLocation as Mock).mockReturnValue({ state: { prevLocation: "/prev" } });

    render(<RedirectIfLoggedIn>child</RedirectIfLoggedIn>);

    expect(navigateMock).toHaveBeenCalledWith("/prev");
  });

  it("should not show children if logged in", () => {
    render(<RedirectIfLoggedIn>child</RedirectIfLoggedIn>);

    expect(screen.queryByText("child")).not.toBeInTheDocument();
  });

  it("should show children if not logged in", () => {
    (useAuthContext as Mock).mockReturnValue({
      isLoggedIn: false,
    });

    render(<RedirectIfLoggedIn>child</RedirectIfLoggedIn>);

    expect(screen.getByText("child")).toBeInTheDocument();
  });
});
