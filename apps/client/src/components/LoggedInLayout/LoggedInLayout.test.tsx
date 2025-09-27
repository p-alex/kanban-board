import { render, screen } from "@testing-library/react";
import LoggedInLayout from "./LoggedInLayout";
import useLocalStorage from "../../hooks/useLocalStorage/useLocalStorage.js";
import { Mock } from "vitest";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter } from "react-router-dom";

vi.mock("../../hooks/useLocalStorage/useLocalStorage.js");

function Component() {
  return (
    <QueryClientProvider client={new QueryClient()}>
      <MemoryRouter>
        <LoggedInLayout>hello</LoggedInLayout>
      </MemoryRouter>
    </QueryClientProvider>
  );
}

describe("LoggedInLayout.tsx", () => {
  let getMock: Mock;
  let setMock: Mock;

  beforeEach(() => {
    getMock = vi.fn();
    setMock = vi.fn();

    (useLocalStorage as Mock).mockReturnValue({
      get: getMock,
      set: setMock,
    });
  });

  it("should display children", () => {
    render(<Component />);
    expect(screen.getByText("hello")).toBeInTheDocument();
  });
});
