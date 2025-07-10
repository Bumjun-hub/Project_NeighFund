import React, { useState } from 'react';
import FundCreateLayout from './FundCreateLayout';
import './FundCreateRewardPage.css';
import { useFunding } from './FundingProvider';
import { useNavigate } from 'react-router-dom';

const FundCreateRewardPage = () => {
  const navigate = useNavigate();
  const [rewards, setRewards] = useState([
    { title: '', description: '', amount: '', quantity: '' },
  ]);
  const { setFundData, fundData } = useFunding();

  const handleChange = (index, field, value) => {
    const newRewards = [...rewards];
    newRewards[index][field] = value;
    setRewards(newRewards);
  };

  const addReward = () => {
    setRewards([...rewards, { title: '', description: '', amount: '', quantity: '' }]);
  };

  const removeReward = (index) => {
    const newRewards = rewards.filter((_, i) => i !== index);
    setRewards(newRewards);
  };


  const handleSubmit = async () => {
    // context에 options 저장
    setFundData((prev) => ({
      ...prev,
      options: rewards,
    }));

    const payload = {
      category: fundData.category,
      fundType: fundData.fundType || "NORMAL", // 기본값 처리
      fundStatus: fundData.fundStatus || "ONGOING",
      title: fundData.title,
      subTitle: fundData.subTitle || "",
      content: fundData.content,
      targetAmount: Number(fundData.targetAmount),
      deadline: new Date(fundData.deadline).toISOString(),
      hashTags: fundData.hashTags || "",
      locationName: fundData.locationName,
      options: rewards.map((r) => ({
        title: r.title,
        description: r.description,
        price: Number(r.amount),
        quantity: Number(r.quantity),
      })),
    };

    const formData = new FormData();

    // ✅ DTO 전체 JSON으로 묶어서 보내기
    formData.append("fundDto", new Blob([JSON.stringify(payload)], { type: "application/json" }));

    // ✅ 대표 이미지
    if (fundData.mainImage) {
      formData.append("mainImage", fundData.mainImage);
    }

    // ✅ 본문 이미지
    fundData.contentImages.forEach((img) => {
      formData.append("contentImages", img);
    });

    // ✅ 토큰 포함해서 fetch
    const token = localStorage.getItem("accessToken");

    try {
      const response = await fetch("http://localhost:3000/api/fund/write", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error("서버 오류 발생");
      }

      alert("펀딩 등록 성공!");
      navigate("/funding/")
    } catch (err) {
      console.error("에러:", err);
      alert("펀딩 등록 실패");
    }
  };




  const isValid = rewards.every(
    (r) => r.title && r.description && r.amount && r.quantity
  );

  return (
    <FundCreateLayout currentStep="리워드 설정">
      <div className="reward-form">
        <h2 className="fund-title">리워드 설정</h2>

        {rewards.map((reward, index) => (
          <div key={index} className="reward-item">
            <input
              type="text"
              placeholder="리워드 제목"
              value={reward.title}
              onChange={(e) => handleChange(index, 'title', e.target.value)}
            />
            <textarea
              placeholder="리워드 설명"
              value={reward.description}
              onChange={(e) => handleChange(index, 'description', e.target.value)}
            />
            <input
              type="number"
              placeholder="금액 (원)"
              value={reward.amount}
              onChange={(e) => handleChange(index, 'amount', e.target.value)}
            />


            <input
              type="number"
              placeholder="재고 수량"
              value={reward.quantity}
              onChange={(e) => handleChange(index, 'quantity', e.target.value)}
              min="1"
            />

            <button className="remove-btn" onClick={() => removeReward(index)}>
              삭제
            </button>
          </div>
        ))}

        <button className="add-btn" onClick={addReward}>+ 리워드 추가</button>
        <button className="next-btn" disabled={!isValid} onClick={handleSubmit}>제출</button>
      </div>
    </FundCreateLayout>
  );
};

export default FundCreateRewardPage;
