import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import gatheringApi from './GatheringAPI'; // 기존 API 경로 사용
import GatheringBoard from './GatheringBoard'; 
import GatheringPhotos from './GatheringPhotos'; 
import './GatheringInfo.css';

const GatheringInfo = () => {
  const { gatheringId } = useParams();
  const navigate = useNavigate();
  const [gathering, setGathering] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isMember, setIsMember] = useState(false);
  const [activeTab, setActiveTab] = useState('intro');
  const [members, setMembers] = useState([]); 
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    fetchGatheringDetail();
  }, [gatheringId]);

  const fetchGatheringDetail = async () => {
    try {
      setLoading(true);
      
      const data = await gatheringApi.getGatheringDetail(gatheringId);
      setGathering(data);
      
      setIsMember(data.isMember || false);
      
      // 참여자 정보도 함께 가져오기
      if (data.members) {
        setMembers(data.members);
      }
      
    } catch (error) {
      console.error('Error fetching gathering detail:', error);
      setError('소모임 정보를 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async () => {
    // 좋아요 기능 구현 
  };

  const handleJoin = () => {
    // 참여하기 버튼 클릭시 GatheringJoin 페이지로 이동
    navigate(`/gatherings/${gatheringId}/join`);
  };

  const toggleMenu = () => {
  setIsMenuOpen(!isMenuOpen);
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
          type: 'FREE'
        }
      }
    });
    setIsMenuOpen(false);
  };

  // 외부 클릭 시 메뉴 닫기
useEffect(() => {
  const handleClickOutside = (event) => {
    if (menuRef.current && !menuRef.current.contains(event.target)) {
      setIsMenuOpen(false);
    }
  };

  document.addEventListener('mousedown', handleClickOutside);
  return () => {
    document.removeEventListener('mousedown', handleClickOutside);
  };
}, []);

  const handleDelete = async () => {
    if (window.confirm('정말로 이 소모임을 삭제하시겠습니까?')) {
      try {
        await gatheringApi.deleteGathering(gatheringId);
        alert('소모임이 삭제되었습니다.');
        navigate('/gathering'); 
      } catch (error) {
        console.error('Delete error:', error);
        alert('삭제하는데 실패했습니다. 다시 시도해주세요.');
      }
    }
    setIsMenuOpen(false);
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
    });
  };

  const getCategoryColor = (category) => {
    const colors = {
      'SPORTS': '#FF6B6B',          
      'SOCIAL': '#4ECDC4',           
      'LITERATURE': '#9B59B6',      
      'OUTDOOR': '#2ECC71',         
      'MUSIC': '#E74C3C',            
      'JOB': '#34495E',              
      'CULTURE': '#8E44AD',          
      'LANGUAGE': '#3498DB',        
      'GAME': '#F39C12',            
      'CRAFT': '#D35400',           
      'DANCE': '#E91E63',            
      'VOLUNTEER': '#27AE60',        
      'PHOTO': '#95A5A6',            
      'SELF_IMPROVEMENT': '#16A085',
      'SPORTS_WATCHING': '#FF8C94',  
      'PET': '#FFB347',              
      'COOKING': '#FFA07A',          
      'CAR_BIKE': '#708090',         
      'STUDY': '#45B7D1'            
    };
    return colors[category] || '#DDA0DD'; 
  };

  const getCategoryText = (category) => {
    const categoryMap = {
      'SPORTS': '스포츠',
      'SOCIAL': '친목',
      'LITERATURE': '문학',
      'OUTDOOR': '아웃도어',
      'MUSIC': '음악',
      'JOB': '직업/취업',
      'CULTURE': '문화',
      'LANGUAGE': '언어',
      'GAME': '게임',
      'CRAFT': '공예/만들기',
      'DANCE': '댄스',
      'VOLUNTEER': '봉사',
      'PHOTO': '사진',
      'SELF_IMPROVEMENT': '자기계발',
      'SPORTS_WATCHING': '스포츠 관람',
      'PET': '반려동물',
      'COOKING': '요리',
      'CAR_BIKE': '자동차/바이크',
      'STUDY': '스터디'
    };
    return categoryMap[category] || category;
  };

  // 참여자 목록 렌더링
  const renderMembersList = () => {
    if (!members || members.length === 0) {
      return <p className="no-members">아직 참여자가 없습니다.</p>;
    }

    return (
      <div className="members-list">
        {members.map((member, index) => {
          console.log(`👤 멤버 ${index + 1}:`, {
            nickname: member.nickname,
            imageUrl: member.imageUrl,
            role: member.role
          });
          
          return (
            <div key={member.id || index} className={`member-item ${member.role === 'LEADER' ? 'leader' : ''}`}>
              <div className="member-avatar">
                {member.imageUrl ? (
                  <img 
                    src={member.imageUrl} 
                    alt={member.nickname}
                    onLoad={() => console.log('✅ 이미지 로드 성공:', member.imageUrl)}
                    onError={(e) => {
                      console.log('❌ 이미지 로드 실패:', member.imageUrl);
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                ) : null}
                <div 
                  className="default-avatar" 
                  style={{ 
                    display: member.imageUrl ? 'none' : 'flex' 
                  }}
                >
                  {member.nickname ? member.nickname.charAt(0).toUpperCase() : '?'}
                </div>
              </div>
              <div className="member-info">
                <div className="member-name">
                  {member.nickname || '알 수 없음'}
                  {member.role === 'LEADER' && (
                    <span className="leader-badge">👑 리더</span>
                  )}
                </div>
                {member.introduction && (
                  <div className="member-introduction">
                    {member.introduction}
                  </div>
                )}
                <div className="member-join-date">
                  {member.joinedAt ? 
                    formatDate(member.joinedAt) + ' 참여' : 
                    '참여일 불명'
                  }
                </div>
              </div>
              <div className="member-role">
                <span className={`role-badge ${(member.role || 'USER').toLowerCase()}`}>
                  {member.role === 'LEADER' ? '리더' : '멤버'}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    );
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
      case 'members':
        return (
          <div className="tab-content">
            <div className="members-section">
              <h3>참여자 목록 ({members.length}명)</h3>
              {renderMembersList()}
            </div>
          </div>
        );
      case 'board':
        return (
          <div className="tab-content">
            {isMember ? (
              <GatheringBoard 
                gatheringId={gatheringId} 
                isMember={isMember} 
              />
            ) : (
              <div className="member-only-content">
                <div className="lock-icon">🔒</div>
                <p>소모임 멤버만 게시판을 볼 수 있습니다.</p>
                <button onClick={handleJoin} className="join-button-inline">
                  소모임 참여하기
                </button>
              </div>
            )}
          </div>
        );
      case 'photos':
        return (
          <div className="tab-content">
            <GatheringPhotos 
              gatheringId={gatheringId} 
              isMember={isMember}
            />
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
            <div className="menu-container" ref={menuRef}>
              <button onClick={toggleMenu} className="menu-button">
                ⋮
              </button>
              {isMenuOpen && (
                <div className="dropdown-menu">
                  <button onClick={handleEdit} className="menu-item">
                    ✏️ 수정
                  </button>
                  <button onClick={handleDelete} className="menu-item">
                    🗑️ 삭제
                  </button>
                </div>
              )}
            </div>
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
              {getCategoryText(gathering.category)}
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
                className={`tab-button ${activeTab === 'members' ? 'active' : ''}`}
                onClick={() => setActiveTab('members')}
              >
                👥 참여자 ({members.length})
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