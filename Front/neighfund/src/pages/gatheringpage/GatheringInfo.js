import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import gatheringApi from './GatheringAPI';
import GatheringBoard from './GatheringBoard'; // 게시판 컴포넌트
import './GatheringInfo.css';

const GatheringInfo = () => {
  const { gatheringId } = useParams();
  const navigate = useNavigate();
  const [gathering, setGathering] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isMember, setIsMember] = useState(false); // 멤버 여부 상태
  const [activeTab, setActiveTab] = useState('intro'); // 활성 탭 상태

  useEffect(() => {
    fetchGatheringDetail();
  }, [gatheringId]);

  const fetchGatheringDetail = async () => {
    try {
      setLoading(true);
      const data = await gatheringApi.getGatheringDetail(gatheringId);
      setGathering(data);
      
      // 멤버 여부 확인 - API에서 받은 데이터 사용
      setIsMember(data.isMember || false);
      
      // 디버깅용 로그
      console.log('Gathering data:', data);
      console.log('Is member:', data.isMember);
      
    } catch (error) {
      console.error('Error fetching gathering detail:', error);
      setError('소모임 정보를 불러오는데 실패했습니다.');
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

  const handleEdit = () => {
    // 수정 페이지로 이동 - 기존 데이터를 state로 전달
    navigate('/GatheringCreate', {
      state: {
        isEdit: true,
        gatheringId: gatheringId,
        gatheringData: {
          title: gathering.title,
          category: gathering.category,
          dongName: gathering.dongName,
          content: gathering.content,
          titleImage: gathering.titleImage,
          type: 'FREE' // 기본값
        }
      }
    });
  };

  const handleDelete = async () => {
    if (window.confirm('정말로 이 소모임을 삭제하시겠습니까?')) {
      try {
        await gatheringApi.deleteGathering(gatheringId);
        alert('소모임이 삭제되었습니다.');
        navigate('/gathering'); // 목록 페이지로 이동
      } catch (error) {
        console.error('Delete error:', error);
        alert('삭제하는데 실패했습니다. 다시 시도해주세요.');
      }
    }
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

  // 탭 메뉴 렌더링
  const renderTabContent = () => {
    switch (activeTab) {
      case 'intro':
        return (
          <div className="tab-content">
            <div className="content-text">
              {gathering.content.split('\n').map((line, index) => (
                <p key={index}>{line}</p>
              ))}
            </div>
          </div>
        );
      case 'board':
        return (
          <div className="tab-content">
            <GatheringBoard 
              gatheringId={gatheringId} 
              isMember={isMember} 
            />
          </div>
        );
      case 'photos':
        return (
          <div className="tab-content">
            <div className="photos-placeholder">
              <p>📷 사진첩 </p>
            </div>
          </div>
        );
      default:
        return null;
    }
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
        <div className="header-actions">
          <div className="owner-actions">
            <button onClick={handleEdit} className="edit-button">
              ✏️ 수정
            </button>
            <button onClick={handleDelete} className="delete-button">
              🗑️ 삭제
            </button>
          </div>
        </div>
        
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

          {/* 탭 메뉴 */}
          <div className="gathering-tabs">
            <div className="tab-menu">
              <button
                className={`tab-button ${activeTab === 'intro' ? 'active' : ''}`}
                onClick={() => setActiveTab('intro')}
              >
                📝 소모임 소개
              </button>
              <button
                className={`tab-button ${activeTab === 'board' ? 'active' : ''}`}
                onClick={() => setActiveTab('board')}
              >
                💬 게시판
                {!isMember && <span className="member-only-indicator">🔒</span>}
              </button>
              <button
                className={`tab-button ${activeTab === 'photos' ? 'active' : ''}`}
                onClick={() => setActiveTab('photos')}
              >
                📷 사진첩
                {!isMember && <span className="member-only-indicator">🔒</span>}
              </button>
            </div>

            {/* 탭 컨텐츠 */}
            {renderTabContent()}
          </div>

          <div className="action-buttons">
            <button 
              onClick={handleLike}
              className={`like-button ${gathering.liked ? 'liked' : ''}`}
            >
              {gathering.liked ? '❤️' : '🤍'} 좋아요 ({gathering.likes})
            </button>
            
            {/* 로그인한 사용자에게 참여하기 버튼 표시 */}
            {!isMember && (
              <button onClick={handleJoin} className="join-button">
                소모임 참여하기
              </button>
            )}
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