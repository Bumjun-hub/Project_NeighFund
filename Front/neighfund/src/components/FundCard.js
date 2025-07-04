import React from 'react';
import './FundCard.css';
import { Link } from 'react-router-dom';

const FundCard = ({ fund }) => {
  const { id, title, subTitle, imageUrl, progressRate, deadline, fundStatus } = fund;

  // ✅ D-day 계산
  const calcDday = (deadlineStr) => {
    if (!deadlineStr) return null;
    const deadlineDate = new Date(deadlineStr);
    const today = new Date();
    const diff = Math.ceil((deadlineDate - today) / (1000 * 60 * 60 * 24));
    return diff >= 0 ? `D-${diff}` : '마감됨';
  };

  return (
    <Link to={`/funding/info/${id}`} className="fund-card">
      <div className="fund-card-image-wrapper">
        <img src={imageUrl} alt={title} className="fund-card-image" />

        <div className="fund-card-badges">
          <span className="badge status">{fundStatus || '진행중'}</span>
          <span className="badge dday">{calcDday(deadline)}</span>
        </div>
      </div>

      <div className="fund-card-content">
        <h3 className="fund-card-title">{title}</h3>
        <p className="fund-card-sub">{subTitle}</p>

        <div className="fund-card-progress">
          <div className="fund-card-bar">
            <div className="filled" style={{ width: `${progressRate || 0}%` }} />
          </div>
          <span className="percent">{progressRate || 0}% 달성</span>
        </div>
      </div>
    </Link>
  );
};

export default FundCard;
