import { render, screen } from "@testing-library/react";
import Board from "./Board";
import { boardMock } from "../../__fixtures__/board";
import { BOARD_TOP_BAR_TEST_ID } from "./BoardTopBar";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

function TestWrapper({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={new QueryClient()}>
      {children}
    </QueryClientProvider>
  );
}

describe("Board.tsx", () => {
  it("should display board top bar", () => {
    render(
      <TestWrapper>
        <Board board={boardMock} />
      </TestWrapper>
    );

    const topBar = screen.getByTestId(BOARD_TOP_BAR_TEST_ID);

    expect(topBar).toBeInTheDocument();
  });
});
