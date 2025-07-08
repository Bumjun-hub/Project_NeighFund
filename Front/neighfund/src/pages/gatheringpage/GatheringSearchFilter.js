import React, { useState } from 'react';
import './GatheringSearchFilter.css';

const GatheringSearchFilter = ({ 
  onSearch, 
  onCategoryFilter, 
  selectedCategory, 
  searchKeyword 
}) => {
  const [keyword, setKeyword] = useState(searchKeyword || '');

  // 카테고리 옵션들
  const categories = [
    { value: '', label: '전체' },
    { value: 'SPORTS', label: '스포츠' },
    { value: 'SOCIAL', label: '친목' },
    { value: 'LITERATURE', label: '문학' },
    { value: 'OUTDOOR', label: '아웃도어' },
    { value: 'MUSIC', label: '음악' },
    { value: 'JOB', label: '직업/취업' },
    { value: 'CULTURE', label: '문화' },
    { value: 'LANGUAGE', label: '언어' },
    { value: 'GAME', label: '게임' },
    { value: 'CRAFT', label: '공예/만들기' },
    { value: 'DANCE', label: '댄스' },
    { value: 'VOLUNTEER', label: '봉사' },
    { value: 'PHOTO', label: '사진' },
    { value: 'SELF_IMPROVEMENT', label: '자기계발' },
    { value: 'SPORTS_WATCHING', label: '스포츠 관람' },
    { value: 'PET', label: '반려동물' },
    { value: 'COOKING', label: '요리' },
    { value: 'CAR_BIKE', label: '자동차/바이크' },
    { value: 'STUDY', label: '스터디' }
  ];

  // 카테고리별 색상
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
    return colors[category] || '#6c757d';
  };

  // 검색어 입력 처리
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setKeyword(value);
    onSearch(value); // 실시간 검색
  };

  // 검색 폼 제출 처리
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    onSearch(keyword);
  };

  // 검색어 초기화
  const handleClearSearch = () => {
    setKeyword('');
    onSearch('');
  };

  // 카테고리 선택 처리
  const handleCategoryClick = (categoryValue) => {
    onCategoryFilter(categoryValue);
  };

  return (
    <div className="gathering-search-filter">
      {/* 검색창 */}
      <div className="search-section">
        <form onSubmit={handleSearchSubmit} className="search-form">
          <div className="search-input-wrapper">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              value={keyword}
              onChange={handleSearchChange}
              placeholder="소모임 제목이나 내용을 검색하세요..."
              className="search-input"
            />
            {keyword && (
              <button
                type="button"
                onClick={handleClearSearch}
                className="clear-button"
              >
                ✕
              </button>
            )}
          </div>
        </form>
      </div>

      {/* 카테고리 필터 */}
      <div className="category-section">
        <h3 className="category-title">카테고리</h3>
        <div className="category-buttons">
          {categories.map((category) => (
            <button
              key={category.value}
              onClick={() => handleCategoryClick(category.value)}
              className={`category-button ${
                selectedCategory === category.value ? 'active' : ''
              }`}
              style={{
                backgroundColor: selectedCategory === category.value 
                  ? getCategoryColor(category.value) 
                  : 'transparent',
                borderColor: getCategoryColor(category.value),
                color: selectedCategory === category.value 
                  ? 'white' 
                  : getCategoryColor(category.value)
              }}
            >
              {category.label}
            </button>
          ))}
        </div>
      </div>

      {/* 필터 결과 표시 */}
      <div className="filter-status">
        {(keyword || selectedCategory) && (
          <div className="active-filters">
            <span className="filter-label">적용된 필터:</span>
            {keyword && (
              <span className="filter-tag search-tag">
                검색: "{keyword}"
                <button onClick={handleClearSearch} className="filter-remove">✕</button>
              </span>
            )}
            {selectedCategory && (
              <span className="filter-tag category-tag">
                카테고리: {categories.find(c => c.value === selectedCategory)?.label}
                <button onClick={() => handleCategoryClick('')} className="filter-remove">✕</button>
              </span>
            )}
            <button 
              onClick={() => {
                handleClearSearch();
                handleCategoryClick('');
              }}
              className="clear-all-filters"
            >
              전체 초기화
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default GatheringSearchFilter;