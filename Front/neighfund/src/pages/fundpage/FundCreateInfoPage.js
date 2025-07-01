import React, { useState } from 'react';
import FundCreateLayout from './FundCreateLayout';
import './FundCreateInfoPage.css';
import { useNavigate } from 'react-router-dom';

const FundCreateInfoPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    category: '',
    title: '',
    goalAmount: '',
    startDate: '',
    endDate: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleNext = () => {
    navigate('/funding/create/story');
  };

  const isValid = Object.values(formData).every((v) => v !== '');

  return (
    <FundCreateLayout currentStep="정보 입력">
      <div className="info-form">
        <h2 className="fund-title">기본 정보 입력</h2>

        <label>
          카테고리
          <select name="category" value={formData.category} onChange={handleChange}>
            <option value="">선택</option>
            <option value="EDUCATION">교육</option>
            <option value="CULTURE">문화</option>
            <option value="FOOD">음식</option>
            <option value="ENVIRONMENT">환경</option>
            <option value="ETC">기타</option>
          </select>
        </label>

        <label>
          프로젝트 제목
          <input type="text" name="title" value={formData.title} onChange={handleChange} />
        </label>

        <label>
          목표 금액 (원)
          <input type="number" name="goalAmount" value={formData.goalAmount} onChange={handleChange} />
        </label>

        <label>
          시작일
          <input type="date" name="startDate" value={formData.startDate} onChange={handleChange} />
        </label>

        <label>
          마감일
          <input type="date" name="endDate" value={formData.endDate} onChange={handleChange} />
        </label>

        <button className="next-btn" disabled={!isValid} onClick={handleNext}>다음</button>
      </div>
    </FundCreateLayout>
  );
};

export default FundCreateInfoPage;
