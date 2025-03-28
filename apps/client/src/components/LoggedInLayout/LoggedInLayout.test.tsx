import { render, screen } from "@testing-library/react";
import LoggedInLayout from "./LoggedInLayout";
import userEvent from "@testing-library/user-event";
import { LocalStorage } from "../../hooks/useLocalStorage/useLocalStorage";

describe("LoggedInLayout.tsx", () => {
  let localStorageMock: LocalStorage;

  beforeEach(() => {
    localStorageMock = {
      get: vi.fn().mockReturnValue(false),
      set: vi.fn(),
    } as unknown as LocalStorage;
  });

  it("should display children", () => {
    render(
      <LoggedInLayout localStorage={localStorageMock}>hello</LoggedInLayout>
    );

    const text = screen.getByText("hello");

    expect(text).toBeInTheDocument();
  });

  it("should show sidebar by default if no isSideBarOpen key in localstorage", () => {
    localStorageMock.get = vi.fn().mockReturnValue(null);

    render(
      <LoggedInLayout localStorage={localStorageMock}>hello</LoggedInLayout>
    );

    expect(screen.getByRole("navigation")).toBeInTheDocument();
  });

  it("should show sidebar or not according to the isSideBarOpen key in localstorage if set", () => {
    window.localStorage.setItem("isSideBarOpen", "false");

    render(
      <LoggedInLayout localStorage={localStorageMock}>hello</LoggedInLayout>
    );

    expect(screen.queryByRole("navigation")).not.toBeInTheDocument();
  });

  it("toggling side bar should call toggleSideBar function", async () => {
    window.localStorage.setItem("isSideBarOpen", "false");

    render(
      <LoggedInLayout localStorage={localStorageMock}>Hello</LoggedInLayout>
    );

    const showSideBarToggle = screen.getByTestId("showSideBarButton");

    await userEvent.click(showSideBarToggle);
  });
});
