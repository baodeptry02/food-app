import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Steps } from 'antd';

const { Step } = Steps;

const StepProgressBar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const steps = [
    { label: 'Menu', path: '/menu' },
    { label: 'Your Order', path: '/me/cart' },
    { label: 'Payment Progress', path: '/payment' },
  ];

  // Xác định bước hiện tại dựa trên URL
  const currentStep = steps.findIndex(
    (step) => step.path === location.pathname
  );

  return (
    <div className="m-5 w-full pb-8">
      <Steps
        current={currentStep}
        className="custom-steps"
        onChange={(step) => {
          if (step <= currentStep) {
            navigate(steps[step].path);
          }
        }}
      >
        {steps.map((step, index) => (
          <Step
            key={index}
            title={step.label}
            className={
              index < currentStep
                ? 'step-finish'
                : index === currentStep
                  ? 'step-process'
                  : 'step-wait'
            }
          />
        ))}
      </Steps>
    </div>
  );
};

export default StepProgressBar;
