import { render, screen } from "@testing-library/react";
import BoardListCard from "./BoardListCard";

describe("BoardListCard.tsx", () => {
  it("should not show img tag if card does not have a cover image set", () => {
    render(
      <BoardListCard
        card={{
          id: "id",
          cover: "",
          listId: "idd",
          title: "title",
          isDone: false,
        }}
      />
    );

    const image = screen.queryByRole("presentation");

    expect(image).not.toBeInTheDocument();
  });

  it("should show img tag if card does has a cover image set", () => {
    render(
      <BoardListCard
        card={{
          id: "id",
          cover: "test",
          listId: "idd",
          title: "title",
          isDone: false,
        }}
      />
    );

    const image = screen.getByRole("presentation") as HTMLImageElement;

    expect(image).toBeInTheDocument();
  });

  it("should display the title", () => {
    render(
      <BoardListCard
        card={{
          id: "id",
          cover: "test",
          listId: "idd",
          title: "cool title",
          isDone: false,
        }}
      />
    );

    const title = screen.getByText("cool title");

    expect(title).toBeInTheDocument();
  });

  it("should set checkbox to checked if isDone is true", () => {
    render(
      <BoardListCard
        card={{
          id: "id",
          cover: "test",
          listId: "idd",
          title: "cool title",
          isDone: true,
        }}
      />
    );

    const checkbox = screen.getByRole("checkbox");

    expect(checkbox).toBeChecked();
  });
});
