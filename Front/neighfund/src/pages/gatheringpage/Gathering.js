import React, { useState, useEffect, useCallback } from 'react';
import { gatheringData } from '../../datas/dummydata';
import './Gathering.css';

const Gathering = () => {
  const [gatherings, setGatherings] = useState(gatheringData);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  // 추가 데이터 로드
  const loadMoreData = useCallback(() => {
    if (!hasMore || isLoading) return;
    
    setIsLoading(true);
    
    // 0.5초 딜레이 후 데이터 로드
    setTimeout(() => {
      // 실제로는 API 호출
      const currentLength = gatherings.length;
      const newData = gatheringData.map((item, index) => ({
        ...item,
        id: item.id + currentLength + index, // ID 중복 방지
        title: item.title + ` (${Math.floor(currentLength / gatheringData.length) + 1}차)`
      }));
      
      setGatherings(prev => [...prev, ...newData]);
      setIsLoading(false);
      
      // 임시로 3번까지만 로드하도록 제한
      if (currentLength >= gatheringData.length * 2) { // 3에서 2로 변경하여 더 빨리 테스트 가능
        setHasMore(false);
      }
    }, 1000);
  }, [gatherings.length, hasMore, isLoading]);

  // 컴포넌트 마운트 시 스크롤 위치 초기화
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // 무한스크롤 구현
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

  // 좋아요 기능
  const handleLike = (id) => {
    setGatherings(prev => 
      prev.map(gathering => 
        gathering.id === id 
          ? { ...gathering, likes: gathering.likes + 1 }
          : gathering
      )
    );
  };

  // 왼쪽 컬럼에 표시할 카드들 (짝수 인덱스)
  const leftColumnCards = gatherings.filter((_, index) => index % 2 === 0);
  
  // 오른쪽 컬럼에 표시할 카드들 (홀수 인덱스)
  const rightColumnCards = gatherings.filter((_, index) => index % 2 === 1);

  return (
    <div className="gathering-container">   
      <div className="gathering-grid">
        <div className="left-column">
          {leftColumnCards.map((gathering) => (
            <div key={gathering.id} className="gathering-card">
              <div className="card-image">
                <img 
                src={gathering.image} 
                alt={gathering.title}
                onError={(e) => {
                    e.target.src = '/images/noImage.png';
                }}
                />
                <span className="category-tag">{gathering.category}</span>
              </div>
              
              <div className="card-content">
                <h3 className="card-title">{gathering.title}</h3>
                <p className="card-description">{gathering.description}</p>
                
                {gathering.price && (
                  <div className="card-price">{gathering.price}</div>
                )}
                
                <div className="card-footer">
                  <div className="card-stats">
                    <span 
                      className="likes" 
                      onClick={() => handleLike(gathering.id)}
                      style={{ cursor: 'pointer' }}
                    >
                      ❤️ {gathering.likes}
                    </span>
                    <span className="comments">💬 {gathering.comments}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="right-column">
          {rightColumnCards.map((gathering) => (
            <div key={gathering.id} className="gathering-card">
              <div className="card-image">
                <img 
                    src={gathering.image} 
                    alt={gathering.title}
                    onError={(e) => {
                        e.target.src = '/images/noImage.png';
                    }}
                    />
                <span className="category-tag">{gathering.category}</span>
              </div>
              
              <div className="card-content">
                <h3 className="card-title">{gathering.title}</h3>
                <p className="card-description">{gathering.description}</p>
                
                {gathering.price && (
                  <div className="card-price">{gathering.price}</div>
                )}
                
                <div className="card-footer">
                  <div className="card-stats">
                    <span 
                      className="likes" 
                      onClick={() => handleLike(gathering.id)}
                      style={{ cursor: 'pointer' }}
                    >
                      ❤️ {gathering.likes}
                    </span>
                    <span className="comments">💬 {gathering.comments}</span>
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
      
      {!hasMore && !isLoading && (
        <div className="end-message">
          <p>모든 모임을 확인했습니다! 🎉</p>
        </div>
      )}
    </div>
  );
};

export default Gathering;