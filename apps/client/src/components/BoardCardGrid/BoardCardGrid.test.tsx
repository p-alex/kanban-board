import { render, screen } from "@testing-library/react";
import BoardCardGrid, { SKELETON_CARD_TEST_ID } from "./BoardCardGrid";
import { boardMock } from "../../__fixtures__/board";
import { MemoryRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const client = new QueryClient();

function Wrapper(props: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={client}>
      <MemoryRouter>{props.children}</MemoryRouter>
    </QueryClientProvider>
  );
}

describe("BoardCardGrid.tsx", () => {
  it("should display items if grid is not loading and there are items", () => {
    render(
      <Wrapper>
        <BoardCardGrid boards={[boardMock, boardMock]} isLoading={false} />
      </Wrapper>
    );

    expect(screen.getAllByRole("listitem")).toHaveLength(2);
  });

  it("should display skeleton items if grid is loading", () => {
    render(
      <Wrapper>
        <BoardCardGrid boards={[boardMock, boardMock]} isLoading={true} />
      </Wrapper>
    );

    expect(screen.getAllByTestId(SKELETON_CARD_TEST_ID)).toHaveLength(12);
  });

  it("should display a message if there are no items", () => {
    render(
      <Wrapper>
        <BoardCardGrid boards={[]} isLoading={false} />
      </Wrapper>
    );

    expect(screen.getByText("You have no boards.")).toBeInTheDocument();
  });
});
