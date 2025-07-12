import { render, screen } from "@testing-library/react";
import EmailVerificationForm from "./EmailVerificationForm";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import useVerifyUser from "../../../api/usecases/user/VerifyUserUsecase/useVerifyUser";
import { Mock } from "vitest";

vi.mock("../../../api/usecases/user/VerifyUserUsecase/useVerifyUser");

describe("EmailVerificationForm.tsx", () => {
  const correctCode = "12345678";
  const incorrectCode = "123";

  const fillValidForm = async () => {
    const verificationCodeInput = screen.getByLabelText(/verification code/i);
    await userEvent.type(verificationCodeInput, correctCode);
  };

  const fillInvalidForm = async () => {
    const verificationCodeInput = screen.getByLabelText(/verification code/i);
    await userEvent.type(verificationCodeInput, incorrectCode);
  };

  let verifyUserMock: Mock;

  beforeEach(() => {
    verifyUserMock = vi.fn();
    (useVerifyUser as Mock).mockImplementation(() => verifyUserMock);
  });

  it("should call verifyUser if form is submitted with valid verification code", async () => {
    render(
      <MemoryRouter>
        <EmailVerificationForm />
      </MemoryRouter>
    );

    await fillValidForm();

    const submitBtn = screen.getByRole("button", { name: /verify account/i });

    await userEvent.click(submitBtn);

    expect(verifyUserMock).toHaveBeenCalledWith(correctCode);
  });

  it("should not call verifyUser if form is submitted with invalid verification code", async () => {
    render(
      <MemoryRouter>
        <EmailVerificationForm />
      </MemoryRouter>
    );

    await fillInvalidForm();

    const submitBtn = screen.getByRole("button", { name: /verify account/i });

    await userEvent.click(submitBtn);

    expect(verifyUserMock).not.toHaveBeenCalled();
  });

  it("should display field errors if form is submitted with invalid data", async () => {
    render(
      <MemoryRouter>
        <EmailVerificationForm />
      </MemoryRouter>
    );

    const submitBtn = screen.getByRole("button", { name: /verify account/i });
    await userEvent.click(submitBtn);

    const errors = screen.getAllByTestId(/textFieldError/i);
    expect(errors.length).toBeGreaterThanOrEqual(1);
  });
});
