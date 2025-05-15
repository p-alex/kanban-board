import { render, screen } from "@testing-library/react";
import Item from "./Item";
import userEvent from "@testing-library/user-event";

describe("Item.tsx", () => {
  it("should call remove item function when clicking on the remove item button", async () => {
    const removeItemMock = vi.fn();

    render(<Item index={0} textField={<p></p>} removeFunc={removeItemMock} />);

    const removeButton = screen.getByRole("button");

    await userEvent.click(removeButton);

    expect(removeItemMock).toHaveBeenCalled();
  });
});
