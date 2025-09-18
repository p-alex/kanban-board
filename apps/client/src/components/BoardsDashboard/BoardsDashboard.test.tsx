import { render, screen, waitFor } from "@testing-library/react";
import BoardsDashboard from "./BoardsDashboard";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import useGetBoards from "../../api/usecases/board/GetBoardsUsecase/useGetBoards";
import { Mock } from "vitest";
import { boardMock } from "../../__fixtures__/board";
import { MemoryRouter } from "react-router-dom";

vi.mock("../../api/usecases/board/GetBoardsUsecase/useGetBoards");

function Wrapper({ children }: { children: React.ReactNode }) {
  return (
    <MemoryRouter>
      <QueryClientProvider client={new QueryClient()}>
        {children}
      </QueryClientProvider>
    </MemoryRouter>
  );
}

describe("BoardsDashboard.tsx", () => {
  beforeEach(() => {
    (useGetBoards as Mock).mockReturnValue({
      boards: [
        { ...boardMock, id: "1", isFavorite: false },
        { ...boardMock, id: "2", isFavorite: true },
        { ...boardMock, id: "3", isFavorite: true },
        { ...boardMock, id: "4", isFavorite: false },
      ],
      favoriteBoards: [
        { ...boardMock, id: "2", isFavorite: true },
        { ...boardMock, id: "3", isFavorite: true },
      ],
      isGetBoardsLoading: false,
      isGetBoardsRefeching: false,
    });
  });

  it("should display all boards section", async () => {
    render(
      <Wrapper>
        <BoardsDashboard />
      </Wrapper>
    );

    await waitFor(() => {
      const sectionTitle = screen.getByText("All Boards (4)");

      const list = screen.getAllByRole("list")[2];

      expect(sectionTitle).toBeInTheDocument();

      expect(list.querySelectorAll("li")).toHaveLength(4);
    });
  });

  it("should display favorite boards section", async () => {
    render(
      <Wrapper>
        <BoardsDashboard />
      </Wrapper>
    );

    await waitFor(() => {
      const sectionTitle = screen.getByText("Favorite Boards (2)");

      const list = screen.getAllByRole("list")[1];

      expect(sectionTitle).toBeInTheDocument();

      expect(list.querySelectorAll("li")).toHaveLength(2);
    });
  });

  it("should not display favorite boards section if the are no favorite boards", () => {
    (useGetBoards as Mock).mockReturnValue({
      boards: [
        { ...boardMock, id: "1", isFavorite: false },
        { ...boardMock, id: "2", isFavorite: false },
        { ...boardMock, id: "3", isFavorite: false },
        { ...boardMock, id: "4", isFavorite: false },
      ],
      favoriteBoards: [],
      isGetBoardsLoading: false,
      isGetBoardsRefeching: false,
    });

    render(
      <Wrapper>
        <BoardsDashboard />
      </Wrapper>
    );

    const sectionTitle = screen.queryByText("Starred Boards (2)");

    expect(sectionTitle).not.toBeInTheDocument();
  });
});
