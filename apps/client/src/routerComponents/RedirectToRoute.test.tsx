import { render } from "@testing-library/react";
import { describe, it, Mock } from "vitest";
import RedirectTo from "./RedirectToRoute.js";
import { useNavigate } from "react-router-dom";

vi.mock("react-router-dom");

describe("RedirectTo.ts", () => {
  let navigateMock: Mock;

  beforeEach(() => {
    navigateMock = vi.fn();

    (useNavigate as Mock).mockReturnValue(navigateMock);
  });

  it("should navigate to specified route and replace navigation history", () => {
    render(<RedirectTo to="/path" />);

    expect(navigateMock).toHaveBeenCalledWith("/path", { replace: true });
  });
});
