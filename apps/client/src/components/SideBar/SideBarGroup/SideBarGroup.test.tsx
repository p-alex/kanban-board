import { render, screen } from "@testing-library/react";
import NavBarGroup from "./SideBarGroup";

describe("SideBarGroup.tsx", () => {
  it("should display the name of the group if one is passed", () => {
    render(<NavBarGroup name="hello" children="" />);

    const name = screen.getByRole("paragraph");

    expect(name).toHaveTextContent("hello");
  });

  it("should not display the name of the group if one is not passed", () => {
    render(<NavBarGroup children="" />);

    const name = screen.queryByRole("paragraph");

    expect(name).toBeNull();
  });

  it("should display children", () => {
    render(<NavBarGroup children={"hello"} />);

    const children = screen.getByText("hello");

    expect(children).toBeInTheDocument();
  });
});
