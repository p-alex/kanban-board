import { render, screen } from "@testing-library/react";
import LoggedInLayout from "./LoggedInLayout";
import userEvent from "@testing-library/user-event";

describe("LoggedInLayout.tsx", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("should display children", () => {
    render(<LoggedInLayout>hello</LoggedInLayout>);

    const text = screen.getByText("hello");

    expect(text).toBeInTheDocument();
  });

  it("should toggle sidebar correctly", async () => {
    render(<LoggedInLayout>hello</LoggedInLayout>);

    expect(screen.getByRole("navigation")).toBeInTheDocument();

    await userEvent.click(screen.getByTestId("hideSideBarButton"));

    expect(screen.queryByRole("navigation")).not.toBeInTheDocument();

    await userEvent.click(screen.getByTestId("showSideBarButton"));

    expect(screen.getByRole("navigation")).toBeInTheDocument();
  });

  it("should show sidebar by default if no isSideBarOpen key in localstorage", () => {
    render(<LoggedInLayout>hello</LoggedInLayout>);

    expect(screen.getByRole("navigation")).toBeInTheDocument();
  });

  it("should show sidebar or not according to the isSideBarOpen key in localstorage if set", () => {
    window.localStorage.setItem("isSideBarOpen", "false");

    render(<LoggedInLayout>hello</LoggedInLayout>);

    expect(screen.queryByRole("navigation")).not.toBeInTheDocument();
  });
});
