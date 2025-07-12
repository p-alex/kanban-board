import { render, screen } from "@testing-library/react";
import ItemList from "./ItemList";

describe("ItemList.tsx", () => {
  it("should display title", () => {
    render(<ItemList title="title" addBtn={""} children={undefined} />);

    expect(screen.getByText("title")).toBeInTheDocument();
  });

  it("should display add button", () => {
    render(
      <ItemList
        title="title"
        addBtn={<button>add button</button>}
        children={undefined}
      />
    );

    expect(
      screen.getByRole("button", { name: "add button" })
    ).toBeInTheDocument();
  });

  it("should display children", () => {
    render(
      <ItemList
        title="title"
        addBtn={<button>add button</button>}
        children={<p data-testid="child">child</p>}
      />
    );

    expect(screen.getByTestId("child")).toBeInTheDocument();
  });
});
