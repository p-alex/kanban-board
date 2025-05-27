import { screen } from "@testing-library/dom";
import userEvent from "@testing-library/user-event";
import { TestComponentWrapper } from "../../../testComponentWrapper";
import EmailVerificationForm from "./EmailVerificationForm";
import { render } from "@testing-library/react";
import { Response } from "../../../api/application/usecases";
import { Mock } from "vitest";
import { HttpError } from "../../../utils/HttpClient";

async function fillFormWithValidData() {
  const verificationCode = screen.getByLabelText(/verification code/i);

  await userEvent.type(verificationCode, "12345678");
}

async function fillFormWithInvalidData() {
  const verificationCode = screen.getByLabelText(/verification code/i);

  await userEvent.type(verificationCode, "12");
}

async function submitForm() {
  const submit = screen.getByRole("button", { name: "Verify Account" });
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

describe("EmailVerificationForm.tsx", () => {
  it("should display a notification if submit request failed", async () => {
    const submitFuncMock = vi.fn(() => {
      throw new HttpError("error", 400, "/", "POST");
    });
    const displayNotificationMock = vi.fn();

    render(
      <TestComponentWrapper>
        <EmailVerificationForm
          displayNotification={displayNotificationMock}
          submitFunc={submitFuncMock}
          callback={() => {}}
        />
      </TestComponentWrapper>
    );

    await fillFormWithValidData();
    await submitForm();

    expect(displayNotificationMock).toHaveBeenCalled();
  });

  it("should not call submitFunc if form is invalid", async () => {
    const submitFuncMock = vi.fn();
    const displayNotificationMock = vi.fn();

    render(
      <TestComponentWrapper>
        <EmailVerificationForm
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
    const callbackMock = vi.fn();

    render(
      <TestComponentWrapper>
        <EmailVerificationForm
          displayNotification={displayNotificationMock}
          submitFunc={submitFuncMock}
          callback={callbackMock}
        />
      </TestComponentWrapper>
    );

    await fillFormWithValidData();
    await submitForm();

    expect(submitFuncMock).toHaveBeenCalled();
    expect(displayNotificationMock).toHaveBeenCalled();
    expect(callbackMock).toHaveBeenCalled();
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
        <EmailVerificationForm
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
