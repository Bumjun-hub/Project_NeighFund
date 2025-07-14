// SuggestionCard.js
import React from 'react';
import './FundCard.css'; // FundCard와 동일 CSS 사용

const SuggestionCard = ({ post }) => {
  // post는 { id, title, content, createdAt, category, ... } 형태라고 가정
  return (
    <div className="fund-card" style={{ cursor: 'pointer' }} onClick={() => window.location.href = `/board/info/${post.category}/${post.id}`}>
      <div className="fund-card-content">
        <h3 className="fund-card-title">{post.title}</h3>
        <p className="fund-card-sub">{post.content?.slice(0, 40) || "내용 없음"}</p>
        <div className="fund-card-info">
          <span>작성일: {new Date(post.createdAt).toLocaleDateString()}</span>
        </div>
      </div>
    </div>
  );
};

export default SuggestionCard;
