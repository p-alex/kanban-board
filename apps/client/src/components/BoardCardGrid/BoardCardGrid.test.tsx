import { render, screen } from "@testing-library/react";
import BoardCardGrid from "./BoardCardGrid";
import { boardMock } from "../../__fixtures__/board";
import { MemoryRouter } from "react-router-dom";

describe("BoardCardGrid.tsx", () => {
  it("should display items if grid is not loading and there are items", () => {
    render(
      <MemoryRouter>
        <BoardCardGrid
          boards={[boardMock, boardMock]}
          isLoading={false}
          noItemsMessage="dasdas"
        />
      </MemoryRouter>
    );

    expect(screen.getAllByRole("listitem")).toHaveLength(2);
  });

  it("should display skeleton items if grid is loading", () => {
    render(
      <MemoryRouter>
        <BoardCardGrid
          boards={[boardMock, boardMock]}
          isLoading={true}
          noItemsMessage="dasdas"
        />
      </MemoryRouter>
    );

    expect(screen.getAllByTestId("skeleton_item")).toHaveLength(12);
  });

  it("should display a message if there are no items", () => {
    render(
      <MemoryRouter>
        <BoardCardGrid boards={[]} isLoading={false} noItemsMessage="dasdas" />
      </MemoryRouter>
    );

    expect(screen.getByText("dasdas")).toBeInTheDocument();
  });
});
