import { render, screen } from "@testing-library/react";
import AuthContextProvider from "./AuthContextProvider";
import useAuthContext from "../../hooks/useAuthContext/useAuthContext";
import userEvent from "@testing-library/user-event";

function TestComponent() {
  const auth = useAuthContext();

  return (
    <div>
      <p data-testid="id">{auth.user.id}</p>
      <p data-testid="username">{auth.user.username}</p>
      <p data-testid="accessToken">{auth.accessToken}</p>
      <p data-testid="isLoggedIn">{auth.isLoggedIn ? "true" : "false"}</p>
      <p data-testid="isLoading">{auth.isLoading ? "true" : "false"}</p>
      <button onClick={() => auth.handleSetIsLoadingTo(!auth.isLoading)}>
        Toggle Loading
      </button>
      <button
        onClick={() =>
          auth.handleSetAuth({ id: "id", username: "username" }, "accessToken")
        }
      >
        Set Auth
      </button>
      <button onClick={() => auth.handleResetAuth()}>Reset Auth</button>
    </div>
  );
}

describe("AuthContextProvider.tsx", () => {
  it("should set default auth state", () => {
    render(
      <AuthContextProvider>
        <TestComponent />
      </AuthContextProvider>
    );

    expect(screen.getByTestId("id")).toHaveTextContent("");
    expect(screen.getByTestId("username")).toHaveTextContent("");
    expect(screen.getByTestId("accessToken")).toHaveTextContent("");
    expect(screen.getByTestId("isLoggedIn")).toHaveTextContent("false");
    expect(screen.getByTestId("isLoading")).toHaveTextContent("false");
  });

  it("should set loading correctly", async () => {
    render(
      <AuthContextProvider>
        <TestComponent />
      </AuthContextProvider>
    );

    const toggleLoading = screen.getByRole("button", {
      name: "Toggle Loading",
    });

    await userEvent.click(toggleLoading);

    const isLoading = screen.getByTestId("isLoading");

    expect(isLoading).toHaveTextContent("true");

    await userEvent.click(toggleLoading);

    expect(isLoading).toHaveTextContent("false");
  });

  it("should set auth", async () => {
    render(
      <AuthContextProvider>
        <TestComponent />
      </AuthContextProvider>
    );

    const setAuthBtn = screen.getByRole("button", {
      name: "Set Auth",
    });

    await userEvent.click(setAuthBtn);

    expect(screen.getByTestId("id")).toHaveTextContent("id");
    expect(screen.getByTestId("username")).toHaveTextContent("username");
    expect(screen.getByTestId("accessToken")).toHaveTextContent("accessToken");
    expect(screen.getByTestId("isLoggedIn")).toHaveTextContent("true");
  });

  it("should reset auth", async () => {
    render(
      <AuthContextProvider>
        <TestComponent />
      </AuthContextProvider>
    );

    const id = screen.getByTestId("id");
    const username = screen.getByTestId("username");
    const accessToken = screen.getByTestId("accessToken");
    const isLoggedIn = screen.getByTestId("isLoggedIn");

    expect(id).toHaveTextContent("");
    expect(username).toHaveTextContent("");
    expect(accessToken).toHaveTextContent("");
    expect(isLoggedIn).toHaveTextContent("false");

    const setAuthBtn = screen.getByRole("button", { name: "Set Auth" });

    await userEvent.click(setAuthBtn);

    expect(id).toHaveTextContent("id");
    expect(username).toHaveTextContent("username");
    expect(accessToken).toHaveTextContent("accessToken");
    expect(isLoggedIn).toHaveTextContent("true");

    const resetAuthBtn = screen.getByRole("button", { name: "Reset Auth" });

    await userEvent.click(resetAuthBtn);

    expect(id).toHaveTextContent("");
    expect(username).toHaveTextContent("");
    expect(accessToken).toHaveTextContent("");
    expect(isLoggedIn).toHaveTextContent("false");
  });
});
