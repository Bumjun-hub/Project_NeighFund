import React from 'react';
import './FundCreateLayout.css';

const steps = ['정책 동의', '정보 입력', '스토리 작성', '리워드 설정'];

const FundCreateLayout = ({ currentStep, children }) => {
  return (
    <div className="fund-create-wrapper">
      <h2 className="fund-create-title">펀딩 기획</h2>

      <div className="fund-create-steps">
        {steps.map((step, idx) => (
          <React.Fragment key={step}>
            <span
              className={`step ${step === currentStep ? 'active' : ''}`}
            >
              {step}
            </span>
            {idx < steps.length - 1 && <span className="step-arrow">&gt;</span>}
          </React.Fragment>
        ))}
      </div>

      <div className="fund-create-content">{children}</div>
    </div>
  );
};

export default FundCreateLayout;
