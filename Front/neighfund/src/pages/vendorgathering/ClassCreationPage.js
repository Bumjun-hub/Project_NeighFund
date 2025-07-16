import React, { useState, useEffect } from 'react';
import './ClassCreationPage.css';

const ClassCreationPage = () => {
  const [agreements, setAgreements] = useState({
    usageTerms: false,
    privacyPolicy: false,
    revenuePolicy: false,
    settlementPolicy: false
  });

  const [isNextEnabled, setIsNextEnabled] = useState(false);

  // 모든 필수 약관이 체크되었는지 확인
  useEffect(() => {
    const allChecked = Object.values(agreements).every(value => value === true);
    setIsNextEnabled(allChecked);
  }, [agreements]);

  // 체크박스 상태 변경 핸들러
  const handleAgreementChange = (key) => {
    setAgreements(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  // 다음 버튼 클릭 핸들러
  const handleNext = () => {
  if (isNextEnabled) {
    window.location.href = '/classinfoinputpage'; 
  }
};

  // 전체 동의 핸들러
  const handleSelectAll = () => {
    const allChecked = Object.values(agreements).every(value => value === true);
    const newState = !allChecked;
    
    setAgreements({
      usageTerms: newState,
      privacyPolicy: newState,
      revenuePolicy: newState,
      settlementPolicy: newState
    });
  };

  const agreementItems = [
    {
      key: 'usageTerms',
      title: '이용약관 동의',
      description: '편의 플랫폼 이용을 위한 기본 약관에 동의합니다',
      required: true
    },
    {
      key: 'privacyPolicy',
      title: '개인 정보 처리방침 동의',
      description: '개인정보 수집, 이용, 제공에 대해 동의합니다.',
      required: true
    },
    {
      key: 'revenuePolicy',
      title: '수수료 정책 동의',
      description: '편의 성공 시 플랫폼 수수료 정책에 동의합니다.',
      required: true
    },
    {
      key: 'settlementPolicy',
      title: '환불정책 동의',
      description: '편의 실패 또는 취소 시 환불 정책에 동의합니다.',
      required: true
    }
  ];

  const allChecked = Object.values(agreements).every(value => value === true);

  return (
    <div className="agreement-class-creation-container">
      <div className="agreement-class-creation-wrapper">
        {/* 메인 타이틀 */}
        <h1 className="agreement-main-title">클래스 오픈</h1>

        {/* 진행 단계 */}
        <div className="agreement-progress-container">
          <div className="agreement-step agreement-step-active">
            <span className="agreement-step-text">정책 동의</span>
          </div>
          <div className="agreement-step-arrow">{'>'}</div>
          <div className="agreement-step">
            <span className="agreement-step-text">정보 입력</span>
          </div>
          <div className="agreement-step-arrow">{'>'}</div>
          <div className="agreement-step">
            <span className="agreement-step-text">세부 정보</span>
          </div>
        
        </div>

        {/* 전체 동의 */}
        <div className={`agreement-item agreement-select-all ${allChecked ? 'agreement-checked' : ''}`}>
          <label className="agreement-checkbox-container">
            <input
              type="checkbox"
              checked={allChecked}
              onChange={handleSelectAll}
              className="agreement-checkbox-input"
            />
            <span className={`agreement-checkmark ${allChecked ? 'agreement-checked' : ''}`}>
              {allChecked && (
                <svg className="agreement-check-icon" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              )}
            </span>
            <div className="agreement-content">
              <span className="agreement-text">전체 동의</span>
              <p className="agreement-desc">모든 필수 약관에 동의합니다</p>
            </div>
          </label>
        </div>

        {/* 개별 약관 동의 */}
        <div className="agreement-list">
          {agreementItems.map((item, index) => (
            <div
              key={item.key}
              className={`agreement-item ${agreements[item.key] ? 'agreement-checked' : ''}`}
              style={{ animationDelay: `${(index + 1) * 0.1}s` }}
            >
              <label className="agreement-checkbox-container">
                <input
                  type="checkbox"
                  checked={agreements[item.key]}
                  onChange={() => handleAgreementChange(item.key)}
                  className="agreement-checkbox-input"
                />
                <span className={`agreement-checkmark ${agreements[item.key] ? 'agreement-checked' : ''}`}>
                  {agreements[item.key] && (
                    <svg className="agreement-check-icon" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </span>
                <div className="agreement-content">
                  <span className="agreement-text">
                    {item.title}
                    {item.required && (
                      <span className="agreement-required">*필수</span>
                    )}
                  </span>
                  <p className="agreement-desc">{item.description}</p>
                </div>
              </label>
            </div>
          ))}
        </div>

        {/* 다음 버튼 */}
        <button
          onClick={handleNext}
          disabled={!isNextEnabled}
          className={`agreement-next-btn ${isNextEnabled ? 'agreement-enabled' : 'agreement-disabled'}`}
        >
          다음 {'>'}
        </button>
      </div>
    </div>
  );
};

export default ClassCreationPage;