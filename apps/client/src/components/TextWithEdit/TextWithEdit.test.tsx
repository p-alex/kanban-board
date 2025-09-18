import { act, render, screen } from "@testing-library/react";
import TextWithEdit from "./TextWithEdit";
import userEvent from "@testing-library/user-event";

describe("TextWithEdit.tsx", () => {
  it("should display children", () => {
    render(
      <TextWithEdit callbackFunc={() => {}} canEdit={false} maxChars={24}>
        value
      </TextWithEdit>
    );

    expect(screen.getByText("value")).toBeInTheDocument();
  });

  it("should toggle edit on click", async () => {
    render(
      <TextWithEdit callbackFunc={() => {}} canEdit={true} maxChars={24}>
        value
      </TextWithEdit>
    );

    const toggle = screen.getByRole("button", { name: "value" });

    await userEvent.click(toggle);

    const input = screen.getByRole("textbox");

    expect(input).toBeInTheDocument();
    expect(toggle).not.toBeInTheDocument();
  });

  it("should toggle off edit on input blur", async () => {
    render(
      <TextWithEdit callbackFunc={() => {}} canEdit={true} maxChars={24}>
        value
      </TextWithEdit>
    );

    await userEvent.click(screen.getByRole("button", { name: "value" }));

    const input = screen.getByRole("textbox");

    await act(async () => {
      input.blur();
    });

    expect(
      await screen.findByRole("button", { name: "value" })
    ).toBeInTheDocument();
  });

  it("should toggle off edit on enter", async () => {
    render(
      <TextWithEdit callbackFunc={() => {}} canEdit={true} maxChars={24}>
        value
      </TextWithEdit>
    );

    await userEvent.click(screen.getByRole("button", { name: "value" }));

    const input = screen.getByRole("textbox");
    await userEvent.type(input, "{enter}");

    expect(
      await screen.findByRole("button", { name: "value" })
    ).toBeInTheDocument();
  });

  it("should call callbackFunc if input is valid", async () => {
    const mockCallback = vi.fn();
    render(
      <TextWithEdit callbackFunc={mockCallback} canEdit={true} maxChars={24}>
        value
      </TextWithEdit>
    );

    await userEvent.click(screen.getByRole("button", { name: "value" }));

    const input = screen.getByRole("textbox");
    await userEvent.clear(input);
    await userEvent.type(input, "new value{enter}");

    expect(mockCallback).toHaveBeenCalledWith("new value");
  });

  it("on toggle on edit should select the value in input", async () => {
    render(
      <TextWithEdit callbackFunc={() => {}} canEdit={true} maxChars={24}>
        value
      </TextWithEdit>
    );

    await userEvent.click(screen.getByRole("button", { name: "value" }));

    const input = screen.getByRole<HTMLInputElement>("textbox");

    expect(input.selectionStart).toBe(0);
    expect(input.selectionEnd).toBe("value".length);
  });
});
