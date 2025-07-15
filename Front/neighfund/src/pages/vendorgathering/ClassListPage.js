import React, { useState, useEffect } from 'react';
import './ClassListPage.css';

const ClassListPage = () => {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [locationFilter, setLocationFilter] = useState('ALL');
  const [reservationModal, setReservationModal] = useState({ isOpen: false, classData: null });

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
      console.log('API 응답 데이터:', data);
      
      // confirmed가 true인 승인된 클래스만 필터링
      const approvedClasses = Array.isArray(data) ? 
        data.filter(cls => cls.confirmed === true) : [];
      
      console.log('전체 클래스 수:', data?.length || 0);
      console.log('승인된 클래스 수:', approvedClasses.length);
      setClasses(approvedClasses);
    } catch (error) {
      console.error('데이터 로딩 실패:', error);
      setClasses([]);
    } finally {
      setLoading(false);
    }
  };

// 예약 모달 컴포넌트
const ReservationModal = ({ classData, onClose }) => {
  const [formData, setFormData] = useState({
    gatheringId: classData.id, 
    participantCount: 1,
    paymentName: '',
    paymentBank: '',
    date: '',
    startTime: '',
    endTime: ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
        // endTime 계산 (startTime + 클래스 소요시간)
      const startTimeDate = new Date(`2000-01-01T${formData.startTime}:00`);
      const durationHours = classData.durationHours || 2; // 기본 2시간
      const endTimeDate = new Date(startTimeDate.getTime() + (durationHours * 60 * 60 * 1000));
      const endTimeString = endTimeDate.toTimeString().substr(0, 5); // HH:MM 형식

      const requestData = {
        gatheringId: classData.id,
        participantCount: formData.participantCount,
        paymentName: formData.paymentName,
        paymentBank: formData.paymentBank,
        date: formData.date,
        startTime: formData.startTime,
        endTime: endTimeString
      };

      console.log('예약 요청 데이터:', requestData);
      
      const response = await fetch(`/api/gatherings/vendor/reservation/${classData.id}`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestData)
      });

      if (response.ok) {
        alert('예약이 성공적으로 완료되었습니다!');
        onClose();
      } else {
        throw new Error('예약 실패');
      }
    } catch (error) {
      console.error('예약 에러:', error);
      alert('예약 처리 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000
    }}>
      <div style={{
        backgroundColor: 'white',
        padding: '24px',
        borderRadius: '8px',
        width: '90%',
        maxWidth: '500px',
        maxHeight: '90vh',
        overflow: 'auto'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 style={{ margin: 0, fontSize: '20px' }}>클래스 예약</h2>
          <button 
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '24px',
              cursor: 'pointer',
              color: '#666'
            }}
          >
            ×
          </button>
        </div>

        <div style={{ marginBottom: '20px', padding: '16px', backgroundColor: '#f8f9fa', borderRadius: '4px' }}>
          <h3 style={{ margin: '0 0 8px 0', fontSize: '16px' }}>{classData.title}</h3>
          <p style={{ margin: '0', color: '#666', fontSize: '14px' }}>
            {classData.productName} | {classData.dongName} | {classData.productPrice?.toLocaleString()}원
          </p>
          <p style={{ margin: '4px 0 0 0', color: '#666', fontSize: '14px' }}>
            소요시간: {classData.durationHours || '2'}시간
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
              참가 인원
            </label>
            <select 
              value={formData.participantCount}
              onChange={(e) => handleChange('participantCount', parseInt(e.target.value))}
              style={{
                width: '100%',
                padding: '8px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '14px'
              }}
            >
              {[...Array(10)].map((_, i) => (
                <option key={i + 1} value={i + 1}>{i + 1}명</option>
              ))}
            </select>
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
              예약자 이름
            </label>
            <input
              type="text"
              value={formData.paymentName}
              onChange={(e) => handleChange('paymentName', e.target.value)}
              required
              style={{
                width: '100%',
                padding: '8px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '14px'
              }}
            />
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
              입금 은행
            </label>
            <input
              type="text"
              value={formData.paymentBank}
              onChange={(e) => handleChange('paymentBank', e.target.value)}
              required
              placeholder="예: 국민은행"
              style={{
                width: '100%',
                padding: '8px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '14px'
              }}
            />
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
              희망 날짜
            </label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => handleChange('date', e.target.value)}
              required
              min={new Date().toISOString().split('T')[0]} // 오늘 이후 날짜만 선택 가능
              style={{
                width: '100%',
                padding: '8px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '14px'
              }}
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
              희망 시간 (시작시간)
            </label>
            <input
              type="time"
              value={formData.startTime}
              onChange={(e) => handleChange('startTime', e.target.value)}
              required
              style={{
                width: '100%',
                padding: '8px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '14px'
              }}
            />
            {formData.startTime && (
              <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: '#666' }}>
                종료 예정 시간: {(() => {
                  const startTime = new Date(`2000-01-01T${formData.startTime}:00`);
                  const duration = classData.durationHours || 2;
                  const endTime = new Date(startTime.getTime() + (duration * 60 * 60 * 1000));
                  return endTime.toTimeString().substr(0, 5);
                })()}
              </p>
            )}
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                flex: 1,
                padding: '12px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                backgroundColor: 'white',
                color: '#666',
                cursor: 'pointer'
              }}
            >
              취소
            </button>
            <button
              type="submit"
              disabled={loading}
              style={{
                flex: 1,
                padding: '12px',
                border: 'none',
                borderRadius: '4px',
                backgroundColor: '#007bff',
                color: 'white',
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.7 : 1
              }}
            >
              {loading ? '처리 중...' : '예약하기'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

  useEffect(() => {
    console.log('ClassListPage 컴포넌트 마운트됨');
    fetchApprovedClasses();
  }, []);

  // 필터링된 클래스 목록
  const filteredClasses = classes.filter(cls => {
    const matchesSearch = (cls.title || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'ALL' || cls.category === categoryFilter;
    const matchesLocation = locationFilter === 'ALL' || (cls.dongName || '').includes(locationFilter);
    
    return matchesSearch && matchesCategory && matchesLocation;
  });

  // 카테고리 목록 추출
  const categories = [...new Set(classes.map(cls => cls.category).filter(Boolean))];
  const locations = [...new Set(classes.map(cls => cls.dongName).filter(Boolean))];

  console.log('렌더링 상태:', { loading, classes: classes.length, filteredClasses: filteredClasses.length });

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
        <h1>원데이 클래스</h1>
        <p>우리 동네에서 즐기는 특별한 클래스들</p>
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
              <option key={category} value={category}>{category}</option>
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
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px', marginTop: '20px' }}>
        {filteredClasses.length > 0 ? (
          filteredClasses.map(cls => (
            <ClassCard 
              key={cls.id} 
              classData={cls} 
              onReservation={(classData) => setReservationModal({ isOpen: true, classData })}
            />
          ))
        ) : (
          <div className="empty-state">
            <p>조건에 맞는 클래스가 없습니다.</p>
            <p>전체 클래스 수: {classes.length}</p>
          </div>
        )}
      </div>

      {/* 예약 모달 */}
      {reservationModal.isOpen && (
        <ReservationModal 
          classData={reservationModal.classData}
          onClose={() => setReservationModal({ isOpen: false, classData: null })}
        />
      )}
    </div>
  );
};

// 클래스 카드 컴포넌트
const ClassCard = ({ classData, onReservation  }) => {
  const handleReservation = () => {
    onReservation(classData);
  };

  return (
    <div style={{
      backgroundColor: 'white',
      border: '1px solid #ddd',
      borderRadius: '8px',
      overflow: 'hidden',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      transition: 'transform 0.2s'
    }}>
      <div style={{ width: '100%', height: '200px', backgroundColor: '#f0f0f0' }}>
        {classData.titleImage ? (
          <img 
            src={classData.titleImage} 
            alt={classData.title}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        ) : (
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            height: '100%',
            color: '#999'
          }}>
            이미지 없음
          </div>
        )}
      </div>
      
      <div style={{ padding: '16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
          <h3 style={{ margin: '0', fontSize: '18px', fontWeight: '600' }}>{classData.title}</h3>
          <span style={{ 
            backgroundColor: '#e3f2fd', 
            color: '#1976d2', 
            padding: '4px 8px', 
            borderRadius: '12px', 
            fontSize: '12px',
            marginLeft: '8px'
          }}>
            {classData.category}
          </span>
        </div>
        
        <div style={{ marginBottom: '12px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', fontSize: '14px' }}>
            <span style={{ color: '#666' }}>상품:</span>
            <span>{classData.productName}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', fontSize: '14px' }}>
            <span style={{ color: '#666' }}>위치:</span>
            <span>{classData.dongName}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', fontSize: '14px' }}>
            <span style={{ color: '#666' }}>소요시간:</span>
            <span>{classData.durationHours || '미정'}</span>
          </div>
        </div>
        
        <div style={{ marginBottom: '16px' }}>
          <p style={{ fontSize: '14px', color: '#666', lineHeight: '1.4', margin: '0' }}>
            {classData.content}
          </p>
        </div>
        
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          paddingTop: '12px',
          borderTop: '1px solid #eee'
        }}>
          <div style={{ fontSize: '18px', fontWeight: '600', color: '#e91e63' }}>
            {classData.productPrice?.toLocaleString()}원
          </div>
          <button 
            onClick={handleReservation}
            style={{
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              padding: '8px 16px',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            예약하기
          </button>
        </div>
      </div>
    </div>
  );
};

export default ClassListPage;