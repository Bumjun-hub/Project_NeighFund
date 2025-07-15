// GatheringCard.js
import React from 'react';
import './FundCard.css';
const GatheringCard = ({ gathering, large }) => {
  // gathering: { id, title, dongName, category, createdAt, titleImage ... }
  console.log('소모임 카드 데이터:', gathering);

  return (
    <div className="fund-card gathering-card">
      {/* 대표 이미지 */}
      {gathering.titleImage && (
        <img
          src={
            gathering.titleImage.startsWith("http")
              ? gathering.titleImage
              : `http://localhost:8080${gathering.titleImage}`
          }
          alt="소모임 대표 이미지"
          className="gathering-img"
        />
      )}
      <div className="fund-card-content">
        <h3 className="fund-card-title">{gathering.title}</h3>
        <div style={{ fontSize: "0.97rem", color: "#4b6bd2" }}>
          📍 {gathering.dongName || "미입력"}
        </div>
        <div className="fund-card-info">
          <span>카테고리: {gathering.category}</span><br />
          <span>참여일: {new Date(gathering.createdAt).toLocaleDateString()}</span>
        </div>
      </div>
    </div>
  );
};



export default GatheringCard;
