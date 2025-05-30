import { render, screen } from "@testing-library/react";
import { TestComponentWrapper } from "../../../testComponentWrapper.js";
import userEvent from "@testing-library/user-event";
import RegisterForm from "./RegisterForm.js";
import { Response } from "../../../api/application/usecases/index.js";
import { Mock } from "vitest";
import HttpError from "../../../utils/HttpClient/HttpError.js";

async function fillFormWithValidData() {
  const username = screen.getByLabelText(/username/i);
  const email = screen.getByLabelText(/email/i);
  const password = screen.getByLabelText(/^password/i);
  const confirmPassword = screen.getByLabelText(/confirm password/i);

  await userEvent.type(username, "user-name");
  await userEvent.type(email, "test@test.com");
  await userEvent.type(password, "Password1");
  await userEvent.type(confirmPassword, "Password1");
}

async function fillFormWithInvalidData() {
  const username = screen.getByLabelText(/username/i);
  const email = screen.getByLabelText(/email/i);
  const password = screen.getByLabelText(/^password/i);
  const confirmPassword = screen.getByLabelText(/confirm password/i);

  await userEvent.type(username, "u-");
  await userEvent.type(email, "test");
  await userEvent.type(password, "P");
  await userEvent.type(confirmPassword, "Pa");
}

async function submitForm() {
  const submit = screen.getByRole("button", { name: "Register" });
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

describe("RegisterForm.tsx", () => {
  it("should display a notification if the request fails", async () => {
    const displayNotificationMock = vi.fn();

    render(
      <TestComponentWrapper>
        <RegisterForm
          displayNotification={displayNotificationMock}
          submitFunc={vi.fn(() => {
            throw new HttpError("", 1, "/", "POST");
          })}
          callback={() => {}}
        />
      </TestComponentWrapper>
    );

    await fillFormWithValidData();
    await submitForm();

    expect(displayNotificationMock).toHaveBeenCalled();
  });

  it("should not call submitFunc if form is invalid", async () => {
    const submitFuncMock = vi.fn().mockResolvedValue({ success: false });
    const displayNotificationMock = vi.fn();

    render(
      <TestComponentWrapper>
        <RegisterForm
          displayNotification={displayNotificationMock}
          submitFunc={submitFuncMock}
          callback={() => {}}
        />
      </TestComponentWrapper>
    );

    await fillFormWithInvalidData();
    await submitForm();

    expect(submitFuncMock).not.toHaveBeenCalled();
    expect(displayNotificationMock).not.toHaveBeenCalled();
  });

  it("should call submitFunc and display notification if form is valid", async () => {
    const submitFuncMock = vi.fn().mockResolvedValue({ success: true });
    const displayNotificationMock = vi.fn();

    render(
      <TestComponentWrapper>
        <RegisterForm
          displayNotification={displayNotificationMock}
          submitFunc={submitFuncMock}
          callback={() => {}}
        />
      </TestComponentWrapper>
    );

    await fillFormWithValidData();
    await submitForm();

    expect(submitFuncMock).toHaveBeenCalled();
    expect(displayNotificationMock).toHaveBeenCalled();
  });

  it("should reset form if submittion was successfull", async () => {
    const submitFuncMock = vi.fn<() => Promise<Response<null>>>(() =>
      Promise.resolve({
        success: true,
        code: 200,
        errors: [],
        result: null,
      })
    );

    render(
      <TestComponentWrapper>
        <RegisterForm
          displayNotification={() => {}}
          submitFunc={submitFuncMock as Mock}
          callback={() => {}}
        />
      </TestComponentWrapper>
    );

    await fillFormWithValidData();
    await submitForm();

    const result = checkIfFormIsEmpty();

    expect(result).toBe(true);
  });
});
