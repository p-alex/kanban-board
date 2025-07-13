import { Mock } from "vitest";
import useAuthContext from "../hooks/useAuthContext/useAuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import { render, screen } from "@testing-library/react";
import ProtectedRoute from "./ProtectedRoute";

vi.mock("../hooks/useAuthContext/useAuthContext");
vi.mock("react-router-dom");

describe("ProtectedRoute.tsx", () => {
  let navigateMock: Mock;
  beforeEach(() => {
    navigateMock = vi.fn();

    (useAuthContext as Mock).mockReturnValue({
      isLoggedIn: false,
    });

    (useNavigate as Mock).mockReturnValue(navigateMock);
    (useLocation as Mock).mockReturnValue({ pathname: "/path" });
  });

  it("if not logged in, should navigate to /login and save previous location to navigation state", () => {
    render(<ProtectedRoute>protected</ProtectedRoute>);

    expect(navigateMock).toHaveBeenCalledWith("/login", {
      state: { prevLocation: "/path" },
      preventScrollReset: true,
    });
  });

  it("should return children if logged in", () => {
    (useAuthContext as Mock).mockReturnValue({
      isLoggedIn: true,
    });

    render(
      <ProtectedRoute>
        <p>child</p>
      </ProtectedRoute>
    );

    expect(screen.getByRole("paragraph")).toBeInTheDocument();
  });

  it("should not display props if not logged in", () => {
    (useAuthContext as Mock).mockReturnValue({
      isLoggedIn: false,
    });

    render(
      <ProtectedRoute>
        <p>child</p>
      </ProtectedRoute>
    );

    expect(screen.queryByRole("paragraph")).not.toBeInTheDocument();
  });
});
