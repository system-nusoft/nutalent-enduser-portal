import React from "react";
import { useTranslation } from "react-i18next";

export interface Step {
  title: string;
  completed: boolean;
}

interface StepperProps {
  steps: Step[];
  currentStep: number;
}

export const Stepper: React.FC<StepperProps> = ({ steps, currentStep }) => {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col">
      <ol className="space-y-8">
        {steps.map((step, index) => (
          <li key={index} className="flex flex-col">
            <div className="flex flex-row items-center gap-3">
              <p
                className={`px-4 py-2 rounded-full text-white font-bold ${
                  currentStep === index && !step.completed
                    ? "bg-blue-600"
                    : step.completed
                    ? "bg-completed"
                    : "bg-incomplete"
                }`}
              >
                {index + 1}
              </p>
              <div className="flex flex-col">
                <p
                  className={`${
                    currentStep === index && !step.completed
                      ? "text-blue-600"
                      : step.completed
                      ? "text-completed"
                      : "text-incomplete"
                  }`}
                >
                  {currentStep === index && !step.completed //if current step and not completed
                    ? t("steps.inProgress")
                    : step.completed
                    ? t("steps.completed")
                    : t("steps.incomplete")}
                </p>
                <p className="lg-text">{step.title}</p>
              </div>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
};
