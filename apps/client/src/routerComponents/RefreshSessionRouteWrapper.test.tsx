import { Mock } from "vitest";
import useRefreshSession from "../api/usecases/auth/RefreshSessionUsecase/useRefreshSession";
import useAuthContext from "../hooks/useAuthContext/useAuthContext";
import { render, screen } from "@testing-library/react";
import RefreshSessionRouteWrapper from "./RefreshSessionRouteWrapper";

vi.mock("../api/usecases/auth/RefreshSessionUsecase/useRefreshSession");
vi.mock("../hooks/useAuthContext/useAuthContext");

describe("RefreshSessionRouteWrapper.tsx", () => {
  let refreshSessionMock: Mock;

  beforeEach(() => {
    refreshSessionMock = vi.fn();

    (useRefreshSession as Mock).mockReturnValue(refreshSessionMock);

    (useAuthContext as Mock).mockReturnValue({
      isLoading: false,
    });
  });

  it("should run refreshSession function on load", () => {
    render(<RefreshSessionRouteWrapper>child</RefreshSessionRouteWrapper>);

    expect(refreshSessionMock).toHaveBeenCalledOnce();
  });

  it("should show loading placeholder if auth.isLoading is true", () => {
    (useAuthContext as Mock).mockReturnValue({
      isLoading: true,
    });

    render(<RefreshSessionRouteWrapper>child</RefreshSessionRouteWrapper>);

    expect(screen.getByTestId("spinner_container")).toBeInTheDocument();
    expect(screen.queryByText("child")).not.toBeInTheDocument();
  });

  it("should show children if auth.isLoading is false", () => {
    render(<RefreshSessionRouteWrapper>child</RefreshSessionRouteWrapper>);

    expect(screen.getByText("child")).toBeInTheDocument();
  });
});
