import React from 'react';
import './SuggestionCard.css';

const categoryMap = {
  EDUCATION: '교육', ENVIRONMENT: '환경', CULTURE: '문화', PET: '애완동물',
  SPORTS: '운동', FOOD: '음식', HOBBY: '취미', WELFARE: '복지', ETC: '기타',
};
const status = {
  FUNDED: '펀딩 완료', ON_HOLD: '보류 중', RECRUITING: '공감하기'
};

const SuggestionCard = ({ post, size = "large", onEdit, onLike }) => {
  if (!post) return null;

  return (
    <div className={`suggestion-card ${size}`} data-category={post.category}>
      {/* 수정 버튼 */}
      {onEdit && (
        <button
          className="suggestion-edit-button"
          onClick={e => { e.stopPropagation(); onEdit(); }}
        >
          ✏
        </button>
      )}
      <div className="suggestion-category">#{categoryMap[post.category]}</div>
      {post.locationName && (
        <div className="suggestion-location">📍 {post.locationName}</div>
      )}
      <div className="title">{post.title}</div>
      <div className="suggestion-content">{post.content}</div>
      <div className="suggestion-username">작성자: {post.username}</div>
      <div className="suggestion-meta">
        <span className="suggestion-likes">♡ {post.likes ?? 0}</span>
        {post.status === 'RECRUITING' ? (
          onLike && (
            <button
              onClick={e => { e.stopPropagation(); onLike(); }}
              className="suggestion-like-button"
            >
              {post.liked ? '💔 공감 취소' : '♡ 공감하기'}
            </button>
          )
        ) : (
          <span className="suggestion-status">
            {status[post.status]}
          </span>
        )}
        <span style={{ color: '#888', fontSize: 13, marginLeft: 12 }}>
          {new Date(post.createdAt).toLocaleDateString()}
        </span>
      </div>
    </div>
  );
};

export default SuggestionCard;
