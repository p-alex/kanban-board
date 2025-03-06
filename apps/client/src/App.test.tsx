import { screen, render } from "@testing-library/react";
import App from "./App";

describe("App.tsx", () => {
  it("should display correct message", () => {
    render(<App />);

    const message = screen.getByText("hello");

    expect(message).toHaveTextContent("hello");
  });
});
