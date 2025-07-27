import { render, screen } from "@testing-library/react";
import BoardCard from "./BoardCard";
import { boardMock } from "../../__fixtures__/board";

describe("BoardCard.tsx", () => {
  it("should display the card's title", () => {
    render(<BoardCard board={boardMock} />);

    expect(screen.getByText(boardMock.title)).toBeInTheDocument();
  });

  it("should display a lock icon if the board is private", async () => {
    render(<BoardCard board={{ ...boardMock, status: "private" }} />);

    expect(screen.getByTestId("lock-icon")).toBeInTheDocument();
  });
});
