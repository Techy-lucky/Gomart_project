import React from 'react';
import '../css files/ALLanimation.css'

// eslint-disable-next-line react/prop-types
const StepProgress = ({ currentStep }) => {
  const steps = [
    { number: 1, label: "Order Details" },
    { number: 2, label: "Payment" },
    { number: 3, label: "Confirmation" }
  ];

  return (
    <div className="anime w-full max-w-2xl mx-auto mb-4 px-8">
      <div className="flex justify-between">
        {steps.map((step, index) => (
          <React.Fragment key={step.number}>
            <div className="flex flex-col items-center relative">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold
                ${currentStep >= step.number 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-200 text-gray-600'}`}>
                {step.number}
              </div>
              <div className="text-xs mt-2 text-gray-600">{step.label}</div>
            </div>
            {index !== steps.length - 1 && (
              <div className="flex-1 h-px my-5 mx-4">
                <div className={`h-full ${currentStep > step.number ? 'bg-blue-600' : 'bg-gray-200'}`}></div>
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default StepProgress;