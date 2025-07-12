import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import Form from "./Form";

describe("Form", () => {
  it("renders children inside the form", () => {
    render(
      <Form>
        <button type="submit">Submit</button>
      </Form>
    );

    expect(screen.getByRole("button", { name: /submit/i })).toBeInTheDocument();
  });

  it("renders title and description when provided", () => {
    render(
      <Form title="Sign Up" description="Create your account">
        <input placeholder="Username" />
      </Form>
    );

    expect(
      screen.getByRole("heading", { name: "Sign Up" })
    ).toBeInTheDocument();
    expect(screen.getByText("Create your account")).toBeInTheDocument();
  });

  it("does not render title or description when not provided", () => {
    render(
      <Form>
        <input placeholder="Username" />
      </Form>
    );

    expect(screen.queryByRole("heading")).not.toBeInTheDocument();
    expect(screen.queryByText(/create your account/i)).not.toBeInTheDocument();
  });

  it("spreads extra props onto the form element", () => {
    const handleSubmit = vi.fn((e) => e.preventDefault());

    render(
      <Form
        data-testid="custom-form"
        onSubmit={handleSubmit}
        method="post"
        action="/submit"
      >
        <button type="submit">Submit</button>
      </Form>
    );

    const form = screen.getByTestId("custom-form");

    expect(form).toHaveAttribute("method", "post");
    expect(form).toHaveAttribute("action", "/submit");

    fireEvent.submit(form);
    expect(handleSubmit).toHaveBeenCalledTimes(1);
  });
});
