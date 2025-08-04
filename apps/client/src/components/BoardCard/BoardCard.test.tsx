import { render, screen } from "@testing-library/react";
import BoardCard from "./BoardCard";
import { boardMock } from "../../__fixtures__/board";
import { MemoryRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import useUpdateBoard from "../../api/usecases/board/UpdateBoardUsecase/useUpdateBoard";
import { Mock } from "vitest";
import userEvent from "@testing-library/user-event";

vi.mock("../../api/usecases/board/UpdateBoardUsecase/useUpdateBoard");
const client = new QueryClient();

function Wrapper(props: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={client}>
      <MemoryRouter>{props.children}</MemoryRouter>
    </QueryClientProvider>
  );
}

describe("BoardCard.tsx", () => {
  let updateBoard: Mock;

  beforeEach(() => {
    updateBoard = vi.fn();

    (useUpdateBoard as Mock).mockReturnValue({
      update: updateBoard,
      isLoading: false,
    });
  });
  it("should display the card's title", () => {
    render(
      <Wrapper>
        <BoardCard board={boardMock} />
      </Wrapper>
    );

    expect(screen.getByText(boardMock.title)).toBeInTheDocument();
  });

  it("should display a lock icon if the board is private", async () => {
    render(
      <Wrapper>
        <BoardCard board={{ ...boardMock, status: "private" }} />
      </Wrapper>
    );

    expect(screen.getByTestId("lock-icon")).toBeInTheDocument();
  });

  it("should display a button with an empty star icon if the board is not set as favorite", () => {
    render(
      <Wrapper>
        <BoardCard board={{ ...boardMock, isFavorite: false }} />
      </Wrapper>
    );

    const emptyStarIcon = screen.getByTestId("emptyStar");

    expect(emptyStarIcon).toBeInTheDocument();
  });

  it("should display a button with a filled star icon if the board is set as favorite", () => {
    render(
      <Wrapper>
        <BoardCard board={{ ...boardMock, isFavorite: true }} />
      </Wrapper>
    );

    const emptyStarIcon = screen.getByTestId("filledStar");

    expect(emptyStarIcon).toBeInTheDocument();
  });

  it("the star toggle button should have the correct title value if board is not marked as favorite", () => {
    render(
      <Wrapper>
        <BoardCard board={{ ...boardMock, isFavorite: false }} />
      </Wrapper>
    );

    const starToggle = screen.getByLabelText(
      `Mark '${boardMock.title}' board as favorite`
    );

    expect(starToggle).toBeInTheDocument();
  });

  it("the star toggle button should have the correct title value if board is marked as favorite", () => {
    render(
      <Wrapper>
        <BoardCard board={{ ...boardMock, isFavorite: true }} />
      </Wrapper>
    );

    const starToggle = screen.getByLabelText(
      `Unmark '${boardMock.title}' board as favorite`
    );

    expect(starToggle).toBeInTheDocument();
  });

  it("should toggle favorite correctly", async () => {
    render(
      <Wrapper>
        <BoardCard board={{ ...boardMock, isFavorite: true }} />
      </Wrapper>
    );

    const starToggle = screen.getByRole("button", {
      name: "Unmark '" + boardMock.title + "' board as favorite",
    });

    await userEvent.click(starToggle);

    expect(updateBoard).toHaveBeenCalledWith({
      ...boardMock,
      isFavorite: false,
    });
  });
});
