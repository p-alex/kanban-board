import { render, screen } from "@testing-library/react";
import Navbar from "./Navbar";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Mock } from "vitest";

const client = new QueryClient();

function Component({ logout }: { logout: Mock }) {
  return (
    <QueryClientProvider client={client}>
      <MemoryRouter>
        <Navbar user={{ id: "id", username: "username" }} logout={logout} />
      </MemoryRouter>
    </QueryClientProvider>
  );
}

describe("Navbar.tsx", () => {
  it("should display the logo", () => {
    render(<Component logout={vi.fn()} />);

    expect(screen.getByTestId("logo")).toBeInTheDocument();
  });

  it("should display correct welcome message", () => {
    render(<Component logout={vi.fn()} />);

    expect(screen.getByText("Welcome, username!")).toBeInTheDocument();
  });

  it("should call logout function if logout button is pressed", async () => {
    const logoutFn = vi.fn();

    render(<Component logout={logoutFn} />);

    const logoutButton = screen.getByRole("button", { name: /logout/i });

    await userEvent.click(logoutButton);

    expect(logoutFn).toHaveBeenCalled();
  });

  it("pressing create board button should toggle a modal", async () => {
    render(<Component logout={vi.fn()} />);

    const createButton = screen.getByRole("button", { name: /create board/i });

    await userEvent.click(createButton);

    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });
});
