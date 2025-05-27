import { render, screen } from "@testing-library/react";
import MultiStep from "./MultiStep";
import userEvent from "@testing-library/user-event";

describe("MultiStep.tsx", () => {
  it("should start with the first step", () => {
    render(
      <MultiStep
        steps={() => [
          { name: "step1", content: <p>p1</p> },
          { name: "step2", content: <p>p2</p> },
        ]}
      />
    );

    expect(screen.getByText("p1")).toBeInTheDocument();
  });

  it("should move to next steps", async () => {
    render(
      <MultiStep
        steps={({ nextStep }) => [
          { name: "step1", content: <button onClick={nextStep}>move1</button> },
          { name: "step2", content: <button onClick={nextStep}>move2</button> },
        ]}
      />
    );

    const nextBtn1 = screen.getByRole("button", { name: "move1" });

    await userEvent.click(nextBtn1);

    expect(screen.getByRole("button", { name: "move2" })).toBeInTheDocument();
  });

  it("should reset multiStep", async () => {
    render(
      <MultiStep
        steps={({ nextStep, reset }) => [
          { name: "step1", content: <button onClick={nextStep}>move1</button> },
          { name: "step2", content: <button onClick={reset}>reset</button> },
        ]}
      />
    );

    const nextBtn1 = screen.getByRole("button", { name: "move1" });

    await userEvent.click(nextBtn1);

    const resetBtn = screen.getByRole("button", { name: "reset" });

    await userEvent.click(resetBtn);

    expect(nextBtn1).toBeInTheDocument();
  });
});
