import { render, screen } from "@testing-library/react";
import VisibilityProvider from "./VisibilityProvider";
import userEvent from "@testing-library/user-event";

describe("VisibilityProvider.tsx", () => {
  it("should redirect focus to toggle when toggled off", async () => {
    render(
      <VisibilityProvider
        toggle={({ toggleVisibility, toggleRef }) => {
          return (
            <button onClick={toggleVisibility} ref={toggleRef}>
              button
            </button>
          );
        }}
        content={({ toggleVisibility }) => (
          <div>
            <button autoFocus onClick={toggleVisibility}>
              Toggle off
            </button>
          </div>
        )}
      />
    );

    const toggle = screen.getByText("button");

    await userEvent.click(toggle);

    expect(toggle).not.toHaveFocus();

    const toggleOff = screen.getByText("Toggle off");

    await userEvent.click(toggleOff);

    expect(toggle).toHaveFocus();
  });

  it("should toggle visibility correctly", async () => {
    render(
      <VisibilityProvider
        toggle={({ toggleVisibility, toggleRef }) => (
          <button onClick={toggleVisibility} ref={toggleRef}>
            toggle
          </button>
        )}
        content={({ toggleVisibility }) => (
          <button onClick={toggleVisibility}>content toggle</button>
        )}
      />
    );

    const toggle = screen.getByText("toggle");

    await userEvent.click(toggle);

    const contentToggle = screen.getByText("content toggle");

    expect(contentToggle).toBeInTheDocument();

    await userEvent.click(contentToggle);

    expect(contentToggle).not.toBeInTheDocument();
  });

  it("disableToggleOff and enableToggleOff should work as expected", async () => {
    render(
      <VisibilityProvider
        toggle={(toggleProps) => (
          <button
            ref={toggleProps.toggleRef}
            onClick={toggleProps.toggleVisibility}
          >
            toggle
          </button>
        )}
        content={(contentProps) => (
          <div data-testid={"content"}>
            <button onClick={() => contentProps.setCanToggleOff(false)}>
              disable close
            </button>
            <button onClick={() => contentProps.setCanToggleOff(true)}>
              enable close
            </button>
            <button onClick={contentProps.toggleVisibility}>close modal</button>
          </div>
        )}
      />
    );

    const toggle = screen.getByRole("button", { name: "toggle" });

    await userEvent.click(toggle);

    const disableToggleOffBtn = screen.getByRole("button", {
      name: "disable close",
    });

    await userEvent.click(disableToggleOffBtn);

    const closeModalBtn = screen.getByRole("button", { name: "close modal" });

    await userEvent.click(closeModalBtn);

    const content = screen.getByTestId("content");

    expect(content).toBeInTheDocument();

    const enableToggleOffBtn = screen.getByRole("button", {
      name: "enable close",
    });

    await userEvent.click(enableToggleOffBtn);

    await userEvent.click(closeModalBtn);

    expect(content).not.toBeInTheDocument();
  });
});
