import { render, screen } from "@testing-library/react";
import RegisterForm from "./RegisterForm";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import useRegisterUser from "../../../api/usecases/user/RegisterUserUsecase/useRegisterUser";
import { Mock } from "vitest";

vi.mock("../../../api/usecases/user/RegisterUserUsecase/useRegisterUser");

describe("RegisterForm.tsx", () => {
  let mockRegisterUser: Mock;

  beforeEach(() => {
    mockRegisterUser = vi.fn().mockResolvedValue({ success: true, errors: [] });

    (useRegisterUser as Mock).mockImplementation(() => {
      return {
        registerUser: mockRegisterUser,
      };
    });
  });

  const fillValidForm = async () => {
    const usernameInput = screen.getByLabelText(/username/i);
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/^password$/i);
    const confirmPasswordInput = screen.getByLabelText(/confirm password/i);

    await userEvent.type(usernameInput, "testuser");
    await userEvent.type(emailInput, "test@example.com");
    await userEvent.type(passwordInput, "Password1");
    await userEvent.type(confirmPasswordInput, "Password1");
  };

  it("should call successCallback if form is submitted with correct input", async () => {
    const successCallbackMock = vi.fn();

    render(
      <MemoryRouter>
        <RegisterForm successCallback={successCallbackMock} />
      </MemoryRouter>
    );

    await fillValidForm();

    const submitBtn = screen.getByRole("button", { name: /register/i });
    await userEvent.click(submitBtn);

    expect(successCallbackMock).toHaveBeenCalled();
  });

  it("should reset form if the form has been submitted successfully", async () => {
    render(
      <MemoryRouter>
        <RegisterForm successCallback={() => {}} />
      </MemoryRouter>
    );

    await fillValidForm();

    const usernameInput = screen.getByLabelText(
      /username/i
    ) as HTMLInputElement;
    const emailInput = screen.getByLabelText(/email/i) as HTMLInputElement;
    const passwordInput = screen.getByLabelText(
      /^password$/i
    ) as HTMLInputElement;
    const confirmPasswordInput = screen.getByLabelText(
      /confirm password/i
    ) as HTMLInputElement;

    const submitBtn = screen.getByRole("button", { name: /register/i });
    await userEvent.click(submitBtn);

    expect(usernameInput.value).toBe("");
    expect(emailInput.value).toBe("");
    expect(passwordInput.value).toBe("");
    expect(confirmPasswordInput.value).toBe("");
  });

  it("should display field errors if form is submitted with invalid data", async () => {
    render(
      <MemoryRouter>
        <RegisterForm successCallback={() => {}} />
      </MemoryRouter>
    );

    const submitBtn = screen.getByRole("button", { name: /register/i });
    await userEvent.click(submitBtn);

    const errors = screen.getAllByTestId(/textFieldError/i);

    expect(errors.length).toBeGreaterThanOrEqual(4);
  });
});
