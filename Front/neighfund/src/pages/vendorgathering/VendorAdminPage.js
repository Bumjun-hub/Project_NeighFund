import React, { useState, useEffect } from 'react';
import './VendorAdminPage.css';

// 메인 컴포넌트
const VendorAdminPage = () => {
  const [activeTab, setActiveTab] = useState('gatherings');
  const [gatherings, setGatherings] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(false);

  // API 호출 함수들
  const fetchGatherings = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/gatherings/vendor/admin/vendor-gatherings', {
        credentials: 'include', // 쿠키 포함
        headers: { 'Content-Type': 'application/json' }
      });
      
      if (response.status === 403) {
        alert('관리자 권한이 필요합니다.');
        return;
      }
      
      const data = await response.json();
      console.log('API 응답 데이터:', data);
      
      if (Array.isArray(data)) {
        setGatherings(data);
      } else {
        console.warn('API 응답이 배열이 아닙니다. 빈 배열로 설정합니다.');
        setGatherings([]);
      }
    } catch (error) {
      console.error('데이터 로딩 실패:', error);
      setGatherings([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchReservations = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/gatherings/vendor/admin/reservations', {
        credentials: 'include', // 쿠키 포함
        headers: { 'Content-Type': 'application/json' }
      });
      
      if (response.status === 403) {
        alert('관리자 권한이 필요합니다.');
        return;
      }
      
      const data = await response.json();
      console.log('예약 API 응답 데이터:', data);
      
      if (Array.isArray(data)) {
        setReservations(data);
      } else {
        console.warn('예약 API 응답이 배열이 아닙니다. 빈 배열로 설정합니다.');
        setReservations([]);
      }
    } catch (error) {
      console.error('예약 데이터 로딩 실패:', error);
      setReservations([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'gatherings') {
      fetchGatherings();
    } else {
      fetchReservations();
    }
  }, [activeTab]);

  return (
    <div className="admin-page">
      <header className="admin-header">
        <h1>관리자 페이지</h1>
        <nav className="admin-nav">
          <button 
            className={activeTab === 'gatherings' ? 'active' : ''}
            onClick={() => setActiveTab('gatherings')}
          >
            원데이클래스 관리
          </button>
          <button 
            className={activeTab === 'reservations' ? 'active' : ''}
            onClick={() => setActiveTab('reservations')}
          >
            예약 관리
          </button>
        </nav>
      </header>

      <main className="admin-content">
        {loading ? (
          <div className="loading">로딩 중...</div>
        ) : (
          <>
            {activeTab === 'gatherings' && (
              <GatheringManagement 
                gatherings={gatherings} 
                onRefresh={fetchGatherings}
              />
            )}
            {activeTab === 'reservations' && (
              <ReservationManagement 
                reservations={reservations} 
                onRefresh={fetchReservations}
              />
            )}
          </>
        )}
      </main>
    </div>
  );
};

// 원데이클래스 관리 컴포넌트
const GatheringManagement = ({ gatherings, onRefresh }) => {
  const [filter, setFilter] = useState('ALL');
  const [expandedRows, setExpandedRows] = useState(new Set());

  console.log('GatheringManagement - gatherings:', gatherings);
  console.log('GatheringManagement - 타입:', typeof gatherings);
  console.log('GatheringManagement - 배열인가?', Array.isArray(gatherings));

  const handleApprove = async (id) => {
    try {
      const response = await fetch(`/api/gatherings/vendor/admin/vendor-gatherings/${id}/approve`, {
        method: 'PUT',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' }
      });
      if (response.ok) {
        alert('승인되었습니다.');
        onRefresh();
      } else if (response.status === 403) {
        alert('관리자 권한이 필요합니다.');
      }
    } catch (error) {
      alert('승인 실패');
    }
  };

  const handleReject = async (id) => {
    if (window.confirm('정말 거절하시겠습니까?')) {
      try {
        const response = await fetch(`/api/gatherings/vendor/admin/vendor-gatherings/${id}/reject`, {
          method: 'PUT',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' }
        });
        if (response.ok) {
          alert('거절되었습니다.');
          onRefresh();
        } else if (response.status === 403) {
          alert('관리자 권한이 필요합니다.');
        }
      } catch (error) {
        alert('거절 실패');
      }
    }
  };

  const toggleRow = (id) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedRows(newExpanded);
  };

  const filteredGatherings = Array.isArray(gatherings) ? gatherings.filter(g => 
    filter === 'ALL' || g.status === filter
  ) : [];

  return (
    <div className="gathering-management">
      <div className="filter-section">
        <select value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="ALL">전체</option>
          <option value="PENDING">승인 대기</option>
          <option value="APPROVED">승인됨</option>
          <option value="REJECTED">거절됨</option>
        </select>
        <span>총 {filteredGatherings.length}개</span>
      </div>

      <table className="admin-table">
        <thead>
          <tr>
            <th>제목</th>
            <th>카테고리</th>
            <th>가격</th>
            <th>위치</th>
            <th>상태</th>
            <th>제출일</th>
            <th>작업</th>
          </tr>
        </thead>
        <tbody>
          {filteredGatherings.length > 0 ? (
            filteredGatherings.map(gathering => (
              <React.Fragment key={gathering.id}>
                <tr onClick={() => toggleRow(gathering.id)} style={{ cursor: 'pointer' }}>
                  <td>{gathering.title}</td>
                  <td>{gathering.category}</td>
                  <td>{gathering.price?.toLocaleString()}원</td>
                  <td>{gathering.location}</td>
                  <td>
                    <span className={`status-badge status-${gathering.status?.toLowerCase()}`}>
                      {gathering.status === 'PENDING' ? '대기' : 
                       gathering.status === 'APPROVED' ? '승인' : '거절'}
                    </span>
                  </td>
                  <td>{new Date(gathering.submittedAt).toLocaleDateString()}</td>
                  <td onClick={(e) => e.stopPropagation()}>
                    {gathering.status === 'PENDING' && (
                      <>
                        <button 
                          className="btn btn-approve"
                          onClick={() => handleApprove(gathering.id)}
                        >
                          승인
                        </button>
                        <button 
                          className="btn btn-reject"
                          onClick={() => handleReject(gathering.id)}
                        >
                          거절
                        </button>
                      </>
                    )}
                  </td>
                </tr>
                {expandedRows.has(gathering.id) && (
                  <tr className="detail-row">
                    <td colSpan="7">
                      <div className="detail-content">
                        <div className="detail-grid">
                          <div>
                            <div className="detail-item">
                              <div className="detail-label">설명</div>
                              <div className="detail-value">{gathering.description}</div>
                            </div>
                            <div className="detail-item">
                              <div className="detail-label">최대 참가자</div>
                              <div className="detail-value">{gathering.maxParticipants}명</div>
                            </div>
                            <div className="detail-item">
                              <div className="detail-label">준비물</div>
                              <div className="detail-value">{gathering.materials}</div>
                            </div>
                          </div>
                          <div>
                            <div className="detail-item">
                              <div className="detail-label">업체명</div>
                              <div className="detail-value">{gathering.vendorName}</div>
                            </div>
                            <div className="detail-item">
                              <div className="detail-label">연락처</div>
                              <div className="detail-value">{gathering.vendorContact}</div>
                            </div>
                            <div className="detail-item">
                              <div className="detail-label">이메일</div>
                              <div className="detail-value">{gathering.vendorEmail}</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))
          ) : (
            <tr>
              <td colSpan="7" style={{ textAlign: 'center', padding: '20px' }}>
                데이터가 없습니다.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

const ReservationManagement = ({ reservations, onRefresh }) => {
  const [filter, setFilter] = useState('ALL');

  const handleStatusUpdate = async (reservationId, newStatus) => {
    try {
      const response = await fetch(`/api/gatherings/vendor/admin/${reservationId}/status?status=${newStatus}`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      if (response.ok) {
        alert('상태가 변경되었습니다.');
        onRefresh();
      }
    } catch (error) {
      alert('상태 변경 실패');
    }
  };

  const filteredReservations = (reservations || []).filter(r => 
    filter === 'ALL' || r.status === filter
  );

  return (
    <div className="reservation-management">
      <div className="filter-section">
        <select value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="ALL">전체</option>
          <option value="PENDING">지불 대기</option>
          <option value="PAID">지불 완료</option>
          <option value="COMPLETED">수강 완료</option>
          <option value="CANCELLED">취소됨</option>
        </select>
        <span>총 {filteredReservations.length}개</span>
      </div>

      <table className="admin-table">
        <thead>
          <tr>
            <th>예약 ID</th>
            <th>클래스명</th>
            <th>예약자</th>
            <th>예약일</th>
            <th>상태</th>
            <th>작업</th>
          </tr>
        </thead>
        <tbody>
          {filteredReservations.map(reservation => (
            <tr key={reservation.id}>
              <td>#{reservation.id}</td>
              <td>{reservation.gatheringTitle}</td>
              <td>
                <div>{reservation.customerName}</div>
                <div style={{ fontSize: '12px', color: '#666' }}>
                  {reservation.customerPhone}
                </div>
              </td>
              <td>{new Date(reservation.reservationDate).toLocaleDateString()}</td>
              <td>
                <span className={`status-badge status-${reservation.status.toLowerCase()}`}>
                  {reservation.status === 'PENDING' ? '지불 대기' : 
                   reservation.status === 'PAID' ? '지불 완료' : 
                   reservation.status === 'COMPLETED' ? '수강 완료' : '취소됨'}
                </span>
              </td>
              <td>
                {reservation.status === 'PENDING' && (
                  <button 
                    className="btn btn-update"
                    onClick={() => handleStatusUpdate(reservation.id, 'PAID')}
                  >
                    입금 확인
                  </button>
                )}
                {reservation.status === 'PAID' && (
                  <button 
                    className="btn btn-update"
                    onClick={() => handleStatusUpdate(reservation.id, 'COMPLETED')}
                  >
                    수강 완료
                  </button>
                )}
                {reservation.status !== 'CANCELLED' && (
                  <button 
                    className="btn btn-reject"
                    onClick={() => handleStatusUpdate(reservation.id, 'CANCELLED')}
                  >
                    취소
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default VendorAdminPage;