import React, { useState } from 'react';
import FundCreateLayout from './FundCreateLayout';
import './FundCreateInfoPage.css';
import { useNavigate } from 'react-router-dom';
import { useFunding } from './FundingProvider';

const FundCreateInfoPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    category: '',
    title: '',
    subTitle: "",
    goalAmount: '',
    endDate: '',
    fundType: '',
  });
  const { setFundData } = useFunding();


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleNext = () => {
    // ✅ context에 저장 (백엔드 DTO 기준 필드명 반영)
    setFundData((prev) => ({
      ...prev,
      category: formData.category,
      fundType: formData.fundType,
      title: formData.title,
      subTitle: formData.subTitle,
      hashTags: formData.hashTags,
      targetAmount: formData.goalAmount,
      deadline: formData.endDate,

    }));

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

        <select
          name="fundType"
          value={formData.fundType}
          onChange={handleChange}
        >
          <option value="">펀딩 유형 선택</option>
          <option value="GENERAL">일반 펀딩</option>
          <option value="COMMUNITY_BASED">주민 제안형</option>
        </select>

        <label>
          프로젝트 제목
          <input type="text" name="title" value={formData.title} onChange={handleChange} />
        </label>

        <label>
          소제목
          <input
            type="text"
            name="subTitle"
            value={formData.subTitle}
            onChange={handleChange}
          />
        </label>

        <label>
          해시태그 (쉼표로 구분)
          <input
            type="text"
            name="hashTags"
            value={formData.hashTags}
            onChange={handleChange}
            placeholder="#환경, #제로웨이스트"
          />
        </label>



        <label>
          목표 금액 (원)
          <input type="number" name="goalAmount" value={formData.goalAmount} onChange={handleChange} />
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
