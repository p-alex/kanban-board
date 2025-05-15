import { render, screen } from "@testing-library/react";
import LoggedInLayout from "./LoggedInLayout";
import userEvent from "@testing-library/user-event";
import { LocalStorage } from "../../hooks/useLocalStorage/useLocalStorage";
import { TestComponentWrapper } from "../../testComponentWrapper";

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
      <TestComponentWrapper>
        <LoggedInLayout localStorage={localStorageMock}>hello</LoggedInLayout>
      </TestComponentWrapper>
    );

    const text = screen.getByText("hello");

    expect(text).toBeInTheDocument();
  });

  it("should show sidebar by default if no isSideBarOpen key in localstorage", () => {
    localStorageMock.get = vi.fn().mockReturnValue(null);

    render(
      <TestComponentWrapper>
        <LoggedInLayout localStorage={localStorageMock}>hello</LoggedInLayout>
      </TestComponentWrapper>
    );

    expect(screen.getByRole("navigation")).toBeInTheDocument();
  });

  it("should show sidebar or not according to the isSideBarOpen key in localstorage if set", () => {
    window.localStorage.setItem("isSideBarOpen", "false");

    render(
      <TestComponentWrapper>
        <LoggedInLayout localStorage={localStorageMock}>hello</LoggedInLayout>
      </TestComponentWrapper>
    );

    expect(screen.queryByRole("navigation")).not.toBeInTheDocument();
  });

  it("toggling side bar should call toggleSideBar function", async () => {
    window.localStorage.setItem("isSideBarOpen", "false");

    render(
      <TestComponentWrapper>
        <LoggedInLayout localStorage={localStorageMock}>hello</LoggedInLayout>
      </TestComponentWrapper>
    );

    const showSideBarToggle = screen.getByTestId("showSideBarButton");

    await userEvent.click(showSideBarToggle);
  });
});
