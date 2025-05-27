import { useState } from "react";

interface Props {
  steps: (stepProps: {
    nextStep: () => void;
    reset: () => void;
  }) => { name: string; content: React.ReactNode }[];
}

function MultiStep(props: Props) {
  const [currentStep, setCurrentStep] = useState(0);

  const nextStep = () => {
    setCurrentStep((prev) => prev + 1);
  };

  const reset = () => {
    setCurrentStep(0);
  };

  return props.steps({ nextStep, reset })[currentStep].content;
}

export default MultiStep;
