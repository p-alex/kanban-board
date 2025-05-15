import { render, screen } from "@testing-library/react";
import CenterLayout from "./CenterLayout";

describe("CenterLayout.tsx", () => {
  it("should display children", () => {
    render(
      <CenterLayout>
        <p>hello</p>
      </CenterLayout>
    );

    const text = screen.getByText("hello");

    expect(text).toBeInTheDocument();
  });
});
