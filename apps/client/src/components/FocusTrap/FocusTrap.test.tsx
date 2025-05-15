import FocusTrap from "./FocusTrap";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

function WrapperComponent() {
  return (
    <div>
      <button className="first-focusable">First button</button>
      <button>Second button</button>
      <FocusTrap redirectToElementWithClass={"first-focusable"}></FocusTrap>
    </div>
  );
}

describe("FocusTrap.tsx", () => {
  it("should redirect to element on focus", async () => {
    render(<WrapperComponent />);

    await userEvent.tab();
    await userEvent.tab();
    await userEvent.tab();

    const buttons = screen.getAllByRole("button");

    expect(buttons[0]).toHaveFocus();
  });
});
