import React, { useState } from 'react';
import FundCreateLayout from './FundCreateLayout';
import './FundCreateInfoPage.css';
import { useNavigate } from 'react-router-dom';
import { useFunding } from './FundingProvider';

// ✅ 검단신도시 동 리스트
const dongOptions = [
  '', // 동 선택
  '마전동',
  '당하동',
  '원당동',
  '불로동',
  '오류동',
  '왕길동',
  '대곡동',
  '금곡동',
  '백석동',
  '아라동',
];


const FundCreateInfoPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    category: '',
    title: '',
    subTitle: "",
    goalAmount: '',
    endDate: '',
    fundType: '',
    locationName: '', // ✅ 동
    hashTags: '',
  });
  const { setFundData } = useFunding();

  // ✅ 입력값 변경 처리
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // ✅ '다음' 클릭 시 context에 저장
  const handleNext = () => {
    setFundData((prev) => ({
      ...prev,
      category: formData.category,
      fundType: formData.fundType,
      title: formData.title,
      subTitle: formData.subTitle,
      hashTags: formData.hashTags,
      targetAmount: formData.goalAmount,
      deadline: formData.endDate,
      //  주민제안형 아니면 locationName에 "없음" 자동 저장
      locationName:
        formData.fundType === "COMMUNITY_BASED"
          ? formData.locationName
          : "없음",
    }));
    navigate('/funding/create/story');
  };


  // ✅ 유효성 검사: 주민제안형일 때만 동 필수
  const isValid = Object.entries(formData).every(([key, v]) =>
    key === "locationName"
      ? formData.fundType !== "COMMUNITY_BASED" || v !== ''
      : v !== ''
  );

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

        {/* ✅ 주민제안형 선택 시 동 선택 노출 */}
        {formData.fundType === 'COMMUNITY_BASED' && (
          <label>
            위치 (동 선택)
            <select name="locationName" value={formData.locationName} onChange={handleChange}>
              {dongOptions.map((dong) => (
                <option key={dong} value={dong}>{dong === '' ? '동 선택' : dong}</option>
              ))}
            </select>
            <p>선택한 동: {formData.locationName}</p>
          </label>
        )}

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

