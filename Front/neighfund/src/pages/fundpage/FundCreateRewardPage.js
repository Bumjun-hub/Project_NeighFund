import React, { useState } from 'react';
import FundCreateLayout from './FundCreateLayout';
import './FundCreateRewardPage.css';

const FundCreateRewardPage = () => {
  const [rewards, setRewards] = useState([
    { title: '', description: '', amount: '' },
  ]);

  const handleChange = (index, field, value) => {
    const newRewards = [...rewards];
    newRewards[index][field] = value;
    setRewards(newRewards);
  };

  const addReward = () => {
    setRewards([...rewards, { title: '', description: '', amount: '' }]);
  };

  const removeReward = (index) => {
    const newRewards = rewards.filter((_, i) => i !== index);
    setRewards(newRewards);
  };

  const isValid = rewards.every(
    (r) => r.title && r.description && r.amount
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
            <button className="remove-btn" onClick={() => removeReward(index)}>
              삭제
            </button>
          </div>
        ))}

        <button className="add-btn" onClick={addReward}>+ 리워드 추가</button>
        <button className="next-btn" disabled={!isValid}>제출</button>
      </div>
    </FundCreateLayout>
  );
};

export default FundCreateRewardPage;
