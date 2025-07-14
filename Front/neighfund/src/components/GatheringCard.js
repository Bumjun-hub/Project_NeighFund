// GatheringCard.js
import React from 'react';
import './FundCard.css';

const GatheringCard = ({ gathering }) => {
  // gathering은 { id, title, dongName, createdAt, category } 등 포함
  return (
    <div className="fund-card" style={{ cursor: 'pointer' }} onClick={() => window.location.href = `/gathering/detail/${gathering.id}`}>
      <div className="fund-card-content">
        <h3 className="fund-card-title">{gathering.title}</h3>
        <p className="fund-card-sub">동네: {gathering.dongName || "미입력"}</p>
        <div className="fund-card-info">
          <span>카테고리: {gathering.category}</span><br/>
          <span>참여일: {new Date(gathering.createdAt).toLocaleDateString()}</span>
        </div>
      </div>
    </div>
  );
};

export default GatheringCard;
