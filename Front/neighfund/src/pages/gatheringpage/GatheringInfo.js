import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './GatheringInfo.css';

const GatheringInfo = () => {
  const { gatheringId } = useParams();
  const navigate = useNavigate();
  const [gathering, setGathering] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchGatheringDetail();
  }, [gatheringId]);

  const fetchGatheringDetail = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      const response = await fetch(`/api/gatherings/free/detail/${gatheringId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('소모임 정보를 불러오는데 실패했습니다.');
      }

      const data = await response.json();
      setGathering(data);
    } catch (error) {
      console.error('Error fetching gathering detail:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async () => {
    // 좋아요 기능 구현 (API 엔드포인트가 있다면)
    console.log('좋아요 클릭');
  };

  const handleJoin = () => {
    // 참여하기 버튼 클릭시 참여 페이지로 이동
    navigate(`/gatherings/${gatheringId}/join`);
  };

  const handleBack = () => {
    navigate(-1);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getCategoryColor = (category) => {
    const colors = {
      'HOBBY': '#FF6B6B',
      'EXERCISE': '#4ECDC4',
      'STUDY': '#45B7D1',
      'FOOD': '#FFA07A',
      'TRAVEL': '#98D8C8',
      'OTHER': '#DDA0DD'
    };
    return colors[category] || '#DDA0DD';
  };

  if (loading) {
    return (
      <div className="gathering-info-container">
        <div className="loading">로딩 중...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="gathering-info-container">
        <div className="error">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (!gathering) {
    return (
      <div className="gathering-info-container">
        <div className="error">
          <p>소모임 정보를 찾을 수 없습니다.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="gathering-info-container">
      <div className="gathering-info-content">
        {gathering.titleImage && (
          <div className="title-image-container">
            <img 
              src={gathering.titleImage} 
              alt={gathering.title}
              className="title-image"
            />
          </div>
        )}

        <div className="gathering-info-body">
          <div className="gathering-header">
            <span 
              className="category-badge"
              style={{ backgroundColor: getCategoryColor(gathering.category) }}
            >
              {gathering.category}
            </span>
            <h1 className="gathering-title">{gathering.title}</h1>
            <p className="dong-name">📍 {gathering.dongName}</p>
          </div>

          <div className="gathering-stats">
            <div className="stat-item">
              <span className="stat-label">참여자</span>
              <span className="stat-value">{gathering.memberCount}명</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">좋아요</span>
              <span className="stat-value">{gathering.likes}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">생성일</span>
              <span className="stat-value">{formatDate(gathering.createdAt)}</span>
            </div>
          </div>

          <div className="gathering-content">
            <h3>소모임 소개</h3>
            <div className="content-text">
              {gathering.content.split('\n').map((line, index) => (
                <p key={index}>{line}</p>
              ))}
            </div>
          </div>

          <div className="action-buttons">
            <button 
              onClick={handleLike}
              className={`like-button ${gathering.liked ? 'liked' : ''}`}
            >
              {gathering.liked ? '❤️' : '🤍'} 좋아요 ({gathering.likes})
            </button>
            <button onClick={handleJoin} className="join-button">
              소모임 참여하기
            </button>
          </div>

          <div className="update-info">
            {gathering.updatedAt && gathering.updatedAt !== gathering.createdAt && (
              <p className="last-updated">
                마지막 수정: {formatDate(gathering.updatedAt)}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GatheringInfo;