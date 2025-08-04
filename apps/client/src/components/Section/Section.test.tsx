import { render, screen } from "@testing-library/react";
import Section from "./Section";

describe("Section", () => {
  it("should display the title", () => {
    render(<Section title="title">g</Section>);

    expect(screen.getByRole("heading", { level: 2 })).toBeInTheDocument();
  });

  it("should display children", () => {
    render(<Section title="title">cool child</Section>);

    expect(screen.getByText("cool child")).toBeInTheDocument();
  });
});
