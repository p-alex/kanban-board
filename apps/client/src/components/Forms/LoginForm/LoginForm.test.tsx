import { render, screen } from "@testing-library/react";
import LoginForm from "./LoginForm";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";

describe("LoginForm.tsx", () => {
  it("should call submitFunc if form is submitted with correct input", async () => {
    const submitMock = vi.fn().mockResolvedValue({ success: true });

    render(
      <MemoryRouter>
        <LoginForm submitFunc={submitMock} />
      </MemoryRouter>
    );

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);

    await userEvent.type(emailInput, "email@email.com");
    await userEvent.type(passwordInput, "Password1");

    const submitBtn = screen.getByRole("button", { name: "Login" });

    await userEvent.click(submitBtn);

    expect(submitMock).toHaveBeenCalled();
  });

  it("should reset form if the form has been submitted successfully", async () => {
    render(
      <MemoryRouter>
        <LoginForm submitFunc={vi.fn().mockResolvedValue({ success: true })} />
      </MemoryRouter>
    );

    const emailInput = screen.getByLabelText(/email/i) as HTMLInputElement;
    const passwordInput = screen.getByLabelText(
      /password/i
    ) as HTMLInputElement;

    await userEvent.type(emailInput, "email@email.com");
    await userEvent.type(passwordInput, "Password1");

    const submitBtn = screen.getByRole("button", { name: "Login" });

    await userEvent.click(submitBtn);

    expect(emailInput.value).toBe("");
    expect(passwordInput.value).toBe("");
  });

  it("should display field errors if form is submitted with invalid data", async () => {
    render(
      <MemoryRouter>
        <LoginForm submitFunc={vi.fn().mockResolvedValue({ success: true })} />
      </MemoryRouter>
    );

    const submitBtn = screen.getByRole("button", { name: "Login" });

    await userEvent.click(submitBtn);

    const errors = screen.getAllByTestId(/textFieldError/i);

    expect(errors).toHaveLength(2);
  });
});
