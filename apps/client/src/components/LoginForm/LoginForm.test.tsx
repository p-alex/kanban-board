import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import LoginForm from "./LoginForm";
import { TestComponentWrapper } from "../../testComponentWrapper";
import { ServerResponse } from "../../api/application/usecases";

async function fillFormWithValidData() {
  const email = screen.getByLabelText(/email/i);
  const password = screen.getByLabelText(/password/i);

  await userEvent.type(email, "test@test.com");
  await userEvent.type(password, "Password1");
}

async function fillFormWithInvalidData() {
  const email = screen.getByLabelText(/email/i);
  const password = screen.getByLabelText(/password/i);

  await userEvent.type(email, "test");
  await userEvent.type(password, "P");
}

async function submitForm() {
  const submit = screen.getByRole("button", { name: "Login" });
  await userEvent.click(submit);
}

function checkIfFormIsEmpty() {
  const inputs = screen.getAllByRole("textbox") as HTMLInputElement[];

  inputs.forEach((input) => {
    if (input.value !== "") {
      return false;
    }
  });

  return true;
}

describe("LoginForm.tsx", () => {
  it("should not call submitFunc if form is invalid", async () => {
    const submitFuncMock = vi.fn();
    const displayNotificationMock = vi.fn();

    render(
      <TestComponentWrapper>
        <LoginForm
          displayNotification={displayNotificationMock}
          submitFunc={submitFuncMock}
        />
      </TestComponentWrapper>
    );

    await fillFormWithInvalidData();
    await submitForm();

    expect(submitFuncMock).not.toHaveBeenCalled();
    expect(displayNotificationMock).not.toHaveBeenCalled();
  });

  it("should call submitFunc and display notification if form is valid", async () => {
    const submitFuncMock = vi.fn();
    const displayNotificationMock = vi.fn();

    render(
      <TestComponentWrapper>
        <LoginForm
          displayNotification={displayNotificationMock}
          submitFunc={submitFuncMock}
        />
      </TestComponentWrapper>
    );

    await fillFormWithValidData();
    await submitForm();

    expect(submitFuncMock).toHaveBeenCalled();
    expect(displayNotificationMock).toHaveBeenCalled();
  });

  it("should reset form if submittion was successfull", async () => {
    const submitFuncMock = vi.fn<() => Promise<ServerResponse>>(() =>
      Promise.resolve({
        success: true,
        message: { shouldDisplay: true, text: "test" },
      })
    );
    render(
      <TestComponentWrapper>
        <LoginForm displayNotification={() => {}} submitFunc={submitFuncMock} />
      </TestComponentWrapper>
    );

    await fillFormWithValidData();
    await submitForm();

    const result = checkIfFormIsEmpty();

    expect(result).toBe(true);
  });
});
