import { render, screen } from "@testing-library/react";
import Navbar from "./Navbar";
import userEvent from "@testing-library/user-event";

describe("Navbar.tsx", () => {
  it("should display the logo", () => {
    render(
      <Navbar user={{ id: "id", username: "username" }} logout={() => {}} />
    );

    expect(screen.getByTestId("logo")).toBeInTheDocument();
  });

  it("should display correct welcome message", () => {
    render(
      <Navbar user={{ id: "id", username: "username" }} logout={() => {}} />
    );

    expect(screen.getByText("Welcome, username!")).toBeInTheDocument();
  });

  it("should call logout function if logout button is pressed", async () => {
    const logoutFn = vi.fn();

    render(
      <Navbar user={{ id: "id", username: "username" }} logout={logoutFn} />
    );

    const logoutButton = screen.getByRole("button", { name: /logout/i });

    await userEvent.click(logoutButton);

    expect(logoutFn).toHaveBeenCalled();
  });
});
