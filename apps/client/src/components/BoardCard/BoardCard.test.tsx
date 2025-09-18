import { render, screen } from "@testing-library/react";
import BoardCard from "./BoardCard";
import { boardMock } from "../../__fixtures__/board";
import { MemoryRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Mock } from "vitest";
import userEvent from "@testing-library/user-event";
import useMarkBoardAsFavorite from "../../api/usecases/board/MarkBoardAsFavoriteUsecase/useMarkBoardAsFavorite";
import useUnmarkBoardAsFavorite from "../../api/usecases/board/UnmarkBoardAsFavoriteUsecase/useUnmarkBoardAsFavorite";

vi.mock(
  "../../api/usecases/board/MarkBoardAsFavoriteUsecase/useMarkBoardAsFavorite"
);
vi.mock(
  "../../api/usecases/board/UnmarkBoardAsFavoriteUsecase/useUnmarkBoardAsFavorite"
);
const client = new QueryClient();

function Wrapper(props: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={client}>
      <MemoryRouter>{props.children}</MemoryRouter>
    </QueryClientProvider>
  );
}

describe("BoardCard.tsx", () => {
  let markBoardAsFavoriteMock: Mock;
  let unmarkBoardAsFavoriteMock: Mock;

  beforeEach(() => {
    markBoardAsFavoriteMock = vi.fn();
    unmarkBoardAsFavoriteMock = vi.fn();

    (useMarkBoardAsFavorite as Mock).mockReturnValue({
      markBoardAsFavorite: markBoardAsFavoriteMock,
      isMarkBoardAsFavoriteLoading: false,
    } as ReturnType<typeof useMarkBoardAsFavorite>);

    (useUnmarkBoardAsFavorite as Mock).mockReturnValue({
      unmarkBoardAsFavorite: unmarkBoardAsFavoriteMock,
      isUnmarkBoardAsFavoriteLoading: false,
    } as ReturnType<typeof useUnmarkBoardAsFavorite>);
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

    const starToggle = screen.getByTitle(
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

    const starToggle = screen.getByTitle(
      `Unmark '${boardMock.title}' board as favorite`
    );

    expect(starToggle).toBeInTheDocument();
  });

  it("should call unmarkBoardAsFavorite if isFavorite is set to true when clicking the star button", async () => {
    render(
      <Wrapper>
        <BoardCard board={{ ...boardMock, isFavorite: true }} />
      </Wrapper>
    );

    const starToggle = screen.getByRole("button", {
      name: "Unmark '" + boardMock.title + "' board as favorite",
    });

    await userEvent.click(starToggle);

    expect(unmarkBoardAsFavoriteMock).toHaveBeenCalled();
  });

  it("should call markBoardAsFavorite if isFavorite is set to false when clicking the star button", async () => {
    render(
      <Wrapper>
        <BoardCard board={{ ...boardMock, isFavorite: false }} />
      </Wrapper>
    );

    const starToggle = screen.getByRole("button", {
      name: "Mark '" + boardMock.title + "' board as favorite",
    });

    await userEvent.click(starToggle);

    expect(markBoardAsFavoriteMock).toHaveBeenCalled();
  });
});
