import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import VendorGatheringDetail from './VendorGatheringDetail';
import './ClassListPage.css';

const ClassListPage = () => {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [locationFilter, setLocationFilter] = useState('ALL');

  const navigate = useNavigate();
  const location = useLocation();

  // URL에서 classId 파라미터 확인
  const isDetailView = location.pathname.includes('/class/');
  const classIdFromUrl = isDetailView ? location.pathname.split('/class/')[1] : null;

  // 카테고리 한글화 함수
  const getCategoryInKorean = (category) => {
    const categoryMap = {
      'COOKING': '요리',
      'BAKING': '베이킹',
      'CRAFT': '공예',
      'ART': '미술',
      'MUSIC': '음악',
      'DANCE': '댄스',
      'FITNESS': '피트니스',
      'BEAUTY': '뷰티',
      'PHOTOGRAPHY': '사진',
      'LANGUAGE': '언어',
      'COMPUTER': '컴퓨터',
      'HOBBY': '취미',
      'EDUCATION': '교육',
      'LIFESTYLE': '라이프스타일',
      'BUSINESS': '비즈니스',
      'HEALTH': '건강',
      'FASHION': '패션',
      'GARDENING': '원예',
      'PET': '반려동물',
      'TRAVEL': '여행',
      'SPORTS': '스포츠',
      'GAME': '게임',
      'MEDITATION': '명상',
      'YOGA': '요가',
      'WINE': '와인',
      'COFFEE': '커피',
      'TEA': '차',
      'FLOWER': '플라워',
      'CANDLE': '캔들',
      'SOAP': '비누',
      'PERFUME': '향수',
      'JEWELRY': '쥬얼리',
      'LEATHER': '가죽공예',
      'WOOD': '목공예',
      'CERAMIC': '도예',
      'PAINTING': '페인팅',
      'DRAWING': '드로잉',
      'CALLIGRAPHY': '서예',
      'KNITTING': '뜨개질',
      'SEWING': '재봉',
      'EMBROIDERY': '자수',
      'ORIGAMI': '종이접기',
      'MAKEUP': '메이크업',
      'NAIL': '네일아트',
      'HAIR': '헤어',
      'SKINCARE': '스킨케어'
    };
    
    return categoryMap[category] || category;
  };

  // 클래스 개설 페이지로 이동
  const handleCreateClass = () => {
    navigate('/classcreationpage');
  };

  // 관리자 페이지로 이동
  const handleGoToAdmin = () => {
    navigate('/VendorAdminPage');
  };

  // 승인된 원데이 클래스 목록 가져오기
  const fetchApprovedClasses = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/gatherings/vendor/list', {
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      // confirmed가 true인 승인된 클래스만 필터링하고 한글 카테고리 추가
      const approvedClasses = Array.isArray(data) ? 
        data.filter(cls => cls.confirmed === true).map(cls => ({
          ...cls,
          categoryKorean: getCategoryInKorean(cls.category)
        })) : [];
      
      setClasses(approvedClasses);
    } catch (error) {
      console.error('데이터 로딩 실패:', error);
      setClasses([]);
    } finally {
      setLoading(false);
    }
  };

  // 상세보기 열기 - URL 변경
  const handleCardClick = (classId) => {
    navigate(`/classlistpage/class/${classId}`);
  };

  // 상세보기에서 목록으로 돌아가기 - URL 변경
  const handleBackToList = () => {
    navigate('/classlistpage');
  };

  useEffect(() => {
    fetchApprovedClasses();
  }, []);

  // URL이 상세보기 경로일 때 VendorGatheringDetail 컴포넌트 렌더링
  if (isDetailView && classIdFromUrl) {
    return (
      <VendorGatheringDetail 
        gatheringId={parseInt(classIdFromUrl)}
        onBack={handleBackToList}
      />
    );
  }

  // 필터링된 클래스 목록
  const filteredClasses = classes.filter(cls => {
    const matchesSearch = (cls.title || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'ALL' || cls.category === categoryFilter;
    const matchesLocation = locationFilter === 'ALL' || (cls.dongName || '').includes(locationFilter);
    
    return matchesSearch && matchesCategory && matchesLocation;
  });

  // 카테고리 목록 추출 (영어 원본을 키로, 한글을 값으로 하는 고유 카테고리)
  const uniqueCategories = [...new Set(classes.map(cls => cls.category).filter(Boolean))];
  const categories = uniqueCategories.map(category => ({
    value: category,
    label: getCategoryInKorean(category)
  }));

  const locations = [...new Set(classes.map(cls => cls.dongName).filter(Boolean))];

  if (loading) {
    return (
      <div className="class-list-page">
        <div className="loading">로딩 중...</div>
      </div>
    );
  }

  return (
    <div className="class-list-page">
      <header className="page-header">
        <div className="header-content">
          <div className="header-buttons">
            <button 
              onClick={handleCreateClass}
              className="create-class-btn"
            >
              + 클래스 개설하기
            </button>
            
            {/* 관리자 페이지 버튼 */}
            <button 
              onClick={handleGoToAdmin}
              className="admin-page-btn"
            >
              ⚙️ 관리자
            </button>
          </div>
        </div>
      </header>

      {/* 검색 및 필터 */}
      <div className="filter-section">
        <div className="search-container">
          <input
            type="text"
            placeholder="클래스명 또는 강사명으로 검색..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
        
        <div className="filter-container">
          <select 
            value={categoryFilter} 
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="filter-select"
          >
            <option value="ALL">모든 카테고리</option>
            {categories.map(category => (
              <option key={category.value} value={category.value}>
                {category.label}
              </option>
            ))}
          </select>

          <select 
            value={locationFilter} 
            onChange={(e) => setLocationFilter(e.target.value)}
            className="filter-select"
          >
            <option value="ALL">모든 지역</option>
            {locations.map(location => (
              <option key={location} value={location}>{location}</option>
            ))}
          </select>
        </div>
      </div>

      {/* 클래스 목록 */}
      <div className="class-grid">
        {filteredClasses.length > 0 ? (
          filteredClasses.map(cls => (
            <ClassCard 
              key={cls.id} 
              classData={cls} 
              onCardClick={() => handleCardClick(cls.id)}
            />
          ))
        ) : (
          <div className="empty-state">
            <p>조건에 맞는 클래스가 없습니다.</p>
            <p>전체 클래스 수: {classes.length}</p>
          </div>
        )}
      </div>
    </div>
  );
};

// 클래스 카드 컴포넌트
const ClassCard = ({ classData, onCardClick }) => {
  return (
    <div 
      onClick={() => onCardClick(classData.id)}
      className="class-card"
    >
      {/* 이미지 */}
      <div className="class-card-image">
        {classData.titleImage ? (
          <img 
            src={classData.titleImage} 
            alt={classData.title}
          />
        ) : (
          <div className="no-image">
            이미지 없음
          </div>
        )}
      </div>
      
      {/* 카드 내용 */}
      <div className="class-card-content">
        {/* 제목과 카테고리 */}
        <div className="class-card-header">
          <h3 className="class-card-title">{classData.title}</h3>
          <span className="class-card-category">
            {classData.categoryKorean}
          </span>
        </div>
        
        {/* 클래스 정보 */}
        <div className="class-card-info">
          <div className="class-card-info-item">
            <span className="label">상품:</span>
            <span className="value">{classData.productName}</span>
          </div>
          <div className="class-card-info-item">
            <span className="label">위치:</span>
            <span className="value">{classData.dongName}</span>
          </div>
          <div className="class-card-info-item">
            <span className="label">소요시간:</span>
            <span className="value">{classData.durationHours || '미정'}시간</span>
          </div>
          <div className="class-card-info-item">
            <span className="label">최대 인원:</span>
            <span className="value">{classData.maxParticipants || '미정'}명</span>
          </div>
        </div>
        
        {/* 설명 */}
        <div className="class-card-description">
          <p>{classData.content}</p>
        </div>
        
        {/* 가격 */}
        <div className="class-card-price">
          <span className="price">
            {classData.productPrice?.toLocaleString()}원
          </span>
        </div>
      </div>
    </div>
  );
};

export default ClassListPage;