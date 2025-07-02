import React, { useState } from 'react';

import './FundCreateTermsPage.css';
import { useNavigate } from 'react-router-dom';
import FundCreateLayout from './FundCreateLayout';

const FundCreateTermsPage = () => {
    const navigate = useNavigate();
    const [agreements, setAgreements] = useState({
        terms: false,
        privacy: false,
        fee: false,
        refund: false,
    });

    const handleChange = (key) => {
        setAgreements({ ...agreements, [key]: !agreements[key] });
    };

    const allChecked = Object.values(agreements).every(Boolean);

    const handleNext = () => {
        if (allChecked) {
            navigate('/funding/create/info');
        }
    };

    return (
        <FundCreateLayout currentStep="정책 동의">
            <div className="terms-wrapper">
                {[
                    { key: 'terms', label: '이용약관 동의', desc: '펀딩 플랫폼 이용을 위한 기본 약관에 동의합니다.' },
                    { key: 'privacy', label: '개인정보 처리방침 동의', desc: '개인정보 수집, 이용, 제공에 대해 동의합니다.' },
                    { key: 'fee', label: '수수료 정책 동의', desc: '펀딩 성공 시 플랫폼 수수료 정책에 동의합니다.' },
                    { key: 'refund', label: '환불정책 동의', desc: '펀딩 실패 또는 취소 시 환불 정책에 동의합니다.' },
                ].map(({ key, label, desc }) => (
                    <label key={key} className="terms-box">
                        <input
                            type="checkbox"
                            checked={agreements[key]}
                            onChange={() => handleChange(key)}
                        />
                        <div className="terms-text">
                            <strong>{label} <span className="required">*필수</span></strong>
                            <p>{desc}</p>
                        </div>
                    </label>
                ))}

                <button
                    className="next-btn"
                    onClick={handleNext}
                    disabled={!allChecked}
                >
                    다음
                </button>
            </div>
        </FundCreateLayout>   
    );
};

export default FundCreateTermsPage;
