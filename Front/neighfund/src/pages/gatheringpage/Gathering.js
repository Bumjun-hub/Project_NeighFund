import React, { useState, useEffect, useCallback } from 'react';
import GatheringAPI from './GatheringAPI';
import './Gathering.css';

const Gathering = () => {
  const [gatherings, setGatherings] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // 초기 데이터 로드
  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await GatheringAPI.getGatheringList();
      setGatherings(data || []);
      
      // 만약 받은 데이터가 적다면 hasMore를 false로 설정
      if (!data || data.length < 10) {
        setHasMore(false);
      }
    } catch (error) {
      console.error('초기 데이터 로드 실패:', error);
      
      // 401 에러라도 빈 배열로 설정하여 목록 페이지는 보여줌
      if (error.message.includes('401')) {
        console.log('로그인하지 않은 사용자 - 빈 목록 표시');
        setGatherings([]);
        setError(null); // 에러 메시지 표시하지 않음
      } else {
        setError('소모임 목록을 불러오는데 실패했습니다.');
        setGatherings([]);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // 페이지네이션이나 무한스크롤을 위한 추가 데이터 로드
  // 현재 백엔드 API가 페이지네이션을 지원하지 않으므로 일시적으로 비활성화
  const loadMoreData = useCallback(() => {
    // 현재 백엔드 API가 페이지네이션을 지원하지 않으므로
    // 추가 로드 기능은 비활성화
    setHasMore(false);
  }, []);

  // 컴포넌트 마운트 시 스크롤 위치 초기화
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // 무한스크롤 구현 (현재는 비활성화)
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
   
    //navigate(`/gatherings/${gatheringId}`);
    
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
      {/* 소모임 생성 버튼 */}
      <div className="gathering-header">
        <button 
          className="create-gathering-btn"
          onClick={() => {
            console.log('버튼 클릭됨');
            window.location.href = '/GatheringCreate';
          }}
        >
          + 새 소모임 만들기
        </button>
      </div>

      <div className="gathering-grid">
        <div className="left-column">
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