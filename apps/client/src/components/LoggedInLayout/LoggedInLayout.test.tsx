import { render, screen } from "@testing-library/react";
import LoggedInLayout from "./LoggedInLayout";
import useLocalStorage from "../../hooks/useLocalStorage/useLocalStorage.js";
import { Mock } from "vitest";
import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter } from "react-router-dom";

vi.mock("../../hooks/useLocalStorage/useLocalStorage.js");

function Component() {
  return (
    <QueryClientProvider client={new QueryClient()}>
      <MemoryRouter>
        <LoggedInLayout>hello</LoggedInLayout>
      </MemoryRouter>
    </QueryClientProvider>
  );
}

describe("LoggedInLayout.tsx", () => {
  let getMock: Mock;
  let setMock: Mock;

  beforeEach(() => {
    getMock = vi.fn();
    setMock = vi.fn();

    (useLocalStorage as Mock).mockReturnValue({
      get: getMock,
      set: setMock,
    });
  });

  it("should display children", () => {
    render(<Component />);
    expect(screen.getByText("hello")).toBeInTheDocument();
  });

  it("should not display side bar if isSideBarVisible is set to false in localStorage", () => {
    getMock.mockReturnValue(false);
    render(<Component />);
    expect(screen.queryByTestId("sidebar")).not.toBeInTheDocument();
  });

  it("should display side bar if isSideBarVisible is set to true in localStorage", () => {
    getMock.mockReturnValue(true);
    render(<Component />);
    expect(screen.queryByTestId("sidebar")).toBeInTheDocument();
  });

  it("should toggle side bar", async () => {
    getMock.mockReturnValue(false);
    render(<Component />);
    expect(screen.queryByTestId("sidebar")).not.toBeInTheDocument();
    const sidebarToggle = screen.getByTestId("sideBarToggle");
    await userEvent.click(sidebarToggle);
    expect(screen.queryByTestId("sidebar")).toBeInTheDocument();
  });

  it("should set isSideBarOpen value in localstorage every time the side bar is toggled", async () => {
    getMock.mockReturnValue(false);
    render(<Component />);
    const sidebarToggle = screen.getByTestId("sideBarToggle");
    await userEvent.click(sidebarToggle);
    expect(setMock).toHaveBeenCalledWith("isSideBarOpen", true);
    await userEvent.click(sidebarToggle);
  });
});
