import React, { useState, useEffect, useCallback } from 'react';
import GatheringAPI from './GatheringAPI';
import './Gathering.css';
import { useNavigate } from 'react-router-dom';
import { checkAuthStatus } from '../../utils/authUtils';

const Gathering = () => {
  const [gatherings, setGatherings] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleCreateGathering = async () => {
    try {
        console.log('🔍 소모임 만들기 버튼 클릭 - 인증 체크 시작');
        
        // 인증 상태 확인
        const authResult = await checkAuthStatus();
        
        if (authResult.isAuthenticated) {
            console.log('✅ 인증 성공 - 소모임 만들기 페이지로 이동');
            window.location.href = '/GatheringCreate';
        } else {
            console.log('❌ 인증 실패 - 로그인 페이지로 이동');
            alert('로그인이 필요한 서비스입니다.');
            window.location.href = '/login';
        }
    } catch (error) {
        console.error('💥 소모임 만들기 버튼 오류:', error);
        alert('오류가 발생했습니다. 다시 시도해주세요.');
    }
};

  // 초기 데이터 로드
  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
  setIsLoading(true);
  setError(null);
  
  try {
    // API에서 에러 처리를 모두 담당하므로 간단히 호출
    const data = await GatheringAPI.getGatheringList();
    setGatherings(data);
    
    // hasMore 설정
    setHasMore(data.length >= 10);
    
  } catch (error) {
    // 이론적으로는 여기까지 오지 않아야 함 (API에서 처리)
    console.error('예상치 못한 에러:', error);
    setGatherings([]);
  } finally {
    setIsLoading(false);
  }
};

  const loadMoreData = useCallback(() => {
    setHasMore(false);
  }, []);

  // 컴포넌트 마운트 시 스크롤 위치 초기화
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
  useEffect(() => {
    const handleScroll = () => {
      if (window.innerHeight + document.documentElement.scrollTop >= 
          document.documentElement.offsetHeight - 1800) { 
        loadMoreData();
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loadMoreData]);

  // 좋아요 기능 (현재는 로컬 상태만 업데이트)
  const handleLike = (id) => {
    setGatherings(prev => 
      prev.map(gathering => 
        gathering.id === id 
          ? { 
              ...gathering, 
              likes: gathering.liked ? gathering.likes - 1 : gathering.likes + 1,
              liked: !gathering.liked 
            }
          : gathering
      )
    );
    
    // TODO: 실제 좋아요 API 호출
    // await GatheringAPI.likeGathering(id);
  };

  // 소모임 카드 클릭 시 상세 페이지로 이동
  const handleCardClick = (gatheringId) => {
   
    navigate(`/gatherings/${gatheringId}`);
    
    // 임시로 콘솔 출력
    console.log('소모임 상세 페이지로 이동:', gatheringId);
  };

  // 이미지 URL 처리 함수
  const getImageUrl = (imagePath) => {
    if (!imagePath) return '/images/noImage.png';
    
    // 절대 경로인 경우 그대로 반환
    if (imagePath.startsWith('http')) return imagePath;
    
    // 상대 경로인 경우 서버 URL과 합치기
    return `http://localhost:8080${imagePath}`;
  };

  // 카테고리 한글 변환
  const getCategoryText = (category) => {
    const categoryMap = {
      'SPORTS': '스포츠',
      'HOBBY': '취미',
      'STUDY': '스터디',
      'SOCIAL': '친목',
      'CULTURE': '문화',
      'VOLUNTEER': '봉사'
    };
    return categoryMap[category] || category;
  };

  // 날짜 포맷팅
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // 에러 상태 렌더링 (401 에러는 제외)
  if (error && gatherings.length === 0) {
    return (
      <div className="gathering-container">
        <div className="error-message">
          <p>{error}</p>
          <button onClick={loadInitialData} className="retry-button">
            다시 시도
          </button>
        </div>
      </div>
    );
  }

  // 왼쪽 컬럼에 표시할 카드들 (짝수 인덱스)
  const leftColumnCards = gatherings.filter((_, index) => index % 2 === 0);
  
  // 오른쪽 컬럼에 표시할 카드들 (홀수 인덱스)
  const rightColumnCards = gatherings.filter((_, index) => index % 2 === 1);

  return (
    <div className="gathering-container">
      <div className="gathering-grid">
        <div className="left-column">
          <div className="gathering-header">
        <button 
          className="create-gathering-btn"
          onClick={handleCreateGathering}
        >
          + 새 소모임 만들기
        </button>
      </div>
          {leftColumnCards.map((gathering) => (
            <div 
              key={gathering.id} 
              className="gathering-card"
              onClick={() => handleCardClick(gathering.id)}
            >
              <div className="card-image">
                <img 
                  src={getImageUrl(gathering.titleImage)} 
                  alt={gathering.title}
                  onError={(e) => {
                    e.target.src = '/images/noImage.png';
                  }}
                />
                <span className="category-tag">
                  {getCategoryText(gathering.category)}
                </span>
              </div>
              
              <div className="card-content">
                <h3 className="card-title">{gathering.title}</h3>
                <p className="card-description">{gathering.content}</p>
                <p className="card-location">📍 {gathering.dongName}</p>
                
                <div className="card-footer">
                  <div className="card-stats">
                    <span 
                      className={`likes ${gathering.liked ? 'liked' : ''}`}
                      onClick={(e) => {
                        e.stopPropagation(); // 카드 클릭 이벤트 방지
                        handleLike(gathering.id);
                      }}
                      style={{ cursor: 'pointer' }}
                    >
                      {gathering.liked ? '❤️' : '🤍'} {gathering.likes || 0}
                    </span>
                    <span className="members">👥 {gathering.memberCount || 0}</span>
                  </div>
                  <div className="card-date">
                    {formatDate(gathering.createdAt)}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="right-column">
          {rightColumnCards.map((gathering) => (
            <div 
              key={gathering.id} 
              className="gathering-card"
              onClick={() => handleCardClick(gathering.id)}
            >
              <div className="card-image">
                <img 
                  src={getImageUrl(gathering.titleImage)} 
                  alt={gathering.title}
                  onError={(e) => {
                    e.target.src = '/images/noImage.png';
                  }}
                />
                <span className="category-tag">
                  {getCategoryText(gathering.category)}
                </span>
              </div>
              
              <div className="card-content">
                <h3 className="card-title">{gathering.title}</h3>
                <p className="card-description">{gathering.content}</p>
                <p className="card-location">📍 {gathering.dongName}</p>
                
                <div className="card-footer">
                  <div className="card-stats">
                    <span 
                      className={`likes ${gathering.liked ? 'liked' : ''}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleLike(gathering.id);
                      }}
                      style={{ cursor: 'pointer' }}
                    >
                      {gathering.liked ? '❤️' : '🤍'} {gathering.likes || 0}
                    </span>
                    <span className="members">👥 {gathering.memberCount || 0}</span>
                  </div>
                  <div className="card-date">
                    {formatDate(gathering.createdAt)}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {isLoading && (
        <div className="loading-indicator">
          <div className="loading-spinner"></div>
          <p>새로운 모임을 불러오는 중...</p>
        </div>
      )}
      
      {!hasMore && !isLoading && gatherings.length > 0 && (
        <div className="end-message">
          <p>모든 모임을 확인했습니다! 🎉</p>
        </div>
      )}

      {!isLoading && gatherings.length === 0 && !error && (
        <div className="empty-message">
          <p>아직 등록된 소모임이 없습니다.</p>
          <p>첫 번째 소모임을 만들어보세요! 🎯</p>
        </div>
      )}
    </div>
  );
};

export default Gathering;