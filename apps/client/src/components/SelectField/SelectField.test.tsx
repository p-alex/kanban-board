import { render, screen } from "@testing-library/react";
import { Mock } from "vitest";
import SelectField from "./SelectField";
import userEvent from "@testing-library/user-event";

const labelText = "label";
const values = ["value1", "value2", "value3"];

function Component(props: { onChange: Mock; error?: string }) {
  return (
    <SelectField
      label={labelText}
      values={values}
      onChange={props.onChange}
      error={props?.error}
    />
  );
}

describe("SelectField.tsx", () => {
  let onChange: Mock;

  beforeAll(() => {
    Element.prototype.scrollIntoView = vi.fn();
  });

  beforeEach(() => {
    onChange = vi.fn();
  });

  it("should display the label", () => {
    render(<Component onChange={onChange} />);

    const label = screen.getByLabelText(labelText);

    expect(label).toBeInTheDocument();
  });

  it("toggle button should have the first value's text as text content", () => {
    render(<Component onChange={onChange} />);

    const toggle = screen.getByRole("button");

    expect(toggle).toHaveTextContent(values[0]);
  });

  it("should toggle dropdown", async () => {
    render(<Component onChange={onChange} />);

    const toggle = screen.getByRole("button");

    await userEvent.click(toggle);

    const optionList = screen.getByRole("list");

    expect(optionList).toBeInTheDocument();

    await userEvent.click(toggle);

    expect(optionList).not.toBeInTheDocument();
  });

  it("clicking on the label should toggle the dropdown", async () => {
    render(<Component onChange={onChange} />);

    const label = screen.getByText(labelText);

    await userEvent.click(label);

    expect(screen.getByRole("list")).toBeInTheDocument();
  });

  it("selecting an option should update the selected value", async () => {
    render(<Component onChange={onChange} />);

    const toggle = screen.getByRole("button");

    await userEvent.click(toggle);

    const optionList = screen.getByRole("list") as HTMLUListElement;

    const firstOption = optionList.querySelectorAll("button")[0];

    await userEvent.click(firstOption);

    expect(optionList).not.toBeInTheDocument();
  });

  it("selecting an option should call onChange prop with the correct arguments", async () => {
    render(<Component onChange={onChange} />);

    const toggle = screen.getByRole("button");

    await userEvent.click(toggle);

    const optionList = screen.getByRole("list") as HTMLUListElement;

    const firstOption = optionList.querySelectorAll("button")[0];

    await userEvent.click(firstOption);

    expect(onChange).toHaveBeenCalledWith(firstOption.textContent);
  });

  it("selecting an option should toggle off the dropdown", async () => {
    render(<Component onChange={onChange} />);

    const toggle = screen.getByRole("button");

    await userEvent.click(toggle);

    const optionList = screen.getByRole("list") as HTMLUListElement;

    const firstOption = optionList.querySelectorAll("button")[0];

    await userEvent.click(firstOption);

    expect(optionList).not.toBeInTheDocument();
  });

  it("toggling off should redirect focus to toggle button", async () => {
    render(<Component onChange={onChange} />);

    const toggle = screen.getByRole("button");

    await userEvent.click(toggle);

    const optionList = screen.getByRole("list") as HTMLUListElement;

    const firstOption = optionList.querySelectorAll("button")[0];

    await userEvent.click(firstOption);

    expect(toggle).toHaveFocus();
  });

  it("if an error is passed, it should be displayed", () => {
    const errorMessage = "this is the error message";

    render(<Component onChange={onChange} error={errorMessage} />);

    expect(screen.getByText(errorMessage)).toBeInTheDocument();
  });

  it("when toggling on, should scroll down enough for the user to see the whole dropdown", async () => {});
});
