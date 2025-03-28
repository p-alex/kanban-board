import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Switch from "./Switch";
import { useEffect, useRef, useState } from "react";

function SwitchWrapper({
  isTurnedOn,
  handleChange,
}: {
  isTurnedOn: boolean;
  handleChange: (value: boolean) => void;
}) {
  const [isOn, setIsOn] = useState(isTurnedOn);

  const isFirstRender = useRef<boolean>(true);

  useEffect(() => {
    if (isFirstRender.current !== true) handleChange(isOn);
    return () => {
      isFirstRender.current = false;
    };
  }, [isOn]);

  return (
    <Switch
      value={isOn}
      handleChange={() => {
        setIsOn((prev) => {
          const nextValue = !prev;
          return nextValue;
        });
      }}
      title={"title"}
    />
  );
}

describe("Switch.tsx", () => {
  it("should apply title attribute to button", () => {
    render(<Switch value={false} handleChange={() => {}} title="title" />);

    const button = screen.getByTitle("title");

    expect(button).toBeInTheDocument();
  });

  it("should handle change correctly", async () => {
    const handleChangeMock = vi.fn();

    render(
      <SwitchWrapper isTurnedOn={false} handleChange={handleChangeMock} />
    );

    const toggle = screen.getByRole("button");

    await userEvent.click(toggle);

    expect(handleChangeMock).toHaveBeenNthCalledWith(1, true);

    await userEvent.click(toggle);

    expect(handleChangeMock).toHaveBeenNthCalledWith(2, false);
  });
});
