import { render, screen } from "@testing-library/react";
import Modal from "./Modal";
import userEvent from "@testing-library/user-event";

describe("Modal.test.tsx", () => {
  it("should toggle off when clicking on backdrop", async () => {
    const toggleOffMock = vi.fn();
    render(<Modal toggleOff={toggleOffMock} content={() => "modal"}></Modal>);

    const backdrop = screen.getByTestId("modalBackdrop");

    await userEvent.click(backdrop);

    expect(toggleOffMock).toHaveBeenCalled();
  });

  it("should display content", () => {
    render(
      <Modal toggleOff={() => {}} content={() => <p>Children</p>}></Modal>
    );

    const paragraph = screen.getByRole("paragraph");

    expect(paragraph).toBeInTheDocument();
    expect(paragraph).toHaveTextContent("Children");
  });
});
