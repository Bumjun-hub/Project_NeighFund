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
      
      if (Array.isArray(data)) {
        setGatherings(data);
      } else {
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
      
      if (Array.isArray(data)) {
        setReservations(data);
      } else {
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
    <div className="vendor-admin-page">
      <header className="vendor-admin-header">
        <h1>관리자 페이지</h1>
        <nav className="vendor-admin-nav">
          <button 
            className={activeTab === 'gatherings' ? 'vendor-admin-nav-btn active' : 'vendor-admin-nav-btn'}
            onClick={() => setActiveTab('gatherings')}
          >
            원데이클래스 관리
          </button>
          <button 
            className={activeTab === 'reservations' ? 'vendor-admin-nav-btn active' : 'vendor-admin-nav-btn'}
            onClick={() => setActiveTab('reservations')}
          >
            예약 관리
          </button>
        </nav>
      </header>

      <main className="vendor-admin-content">
        {loading ? (
          <div className="vendor-admin-loading">로딩 중...</div>
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

  // 삭제 기능
  const handleDelete = async (id, title) => {
    if (window.confirm(`'${title}' 클래스를 정말 삭제하시겠습니까?\n\n⚠️ 이 작업은 되돌릴 수 없습니다.`)) {
      try {
        const response = await fetch(`/api/gatherings/vendor/gathering/${id}`, {
          method: 'DELETE',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' }
        });
        
        if (response.ok) {
          const result = await response.json();
          alert(result.message || '원데이클래스가 삭제되었습니다.');
          onRefresh();
        } else if (response.status === 403) {
          alert('관리자 권한이 필요합니다.');
        } else if (response.status === 404) {
          alert('해당 클래스를 찾을 수 없습니다.');
        } else if (response.status === 409) {
          // 409 Conflict 에러 처리
          try {
            const errorData = await response.json();
            alert(`삭제할 수 없습니다: ${errorData.message || '이미 예약이 있거나 진행 중인 클래스입니다.'}`);
          } catch {
            const errorText = await response.text();
            alert(`삭제할 수 없습니다: ${errorText || '이미 예약이 있거나 진행 중인 클래스입니다.'}`);
          }
        } else {
          try {
            const errorData = await response.json();
            alert(`삭제 실패: ${errorData.message || '알 수 없는 오류가 발생했습니다.'}`);
          } catch {
            const errorText = await response.text();
            alert(`삭제 실패: ${errorText || '서버 오류가 발생했습니다.'}`);
          }
        }
      } catch (error) {
        console.error('삭제 실패:', error);
        alert('네트워크 오류로 삭제에 실패했습니다.');
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
    <div className="vendor-gathering-management">
      <div className="vendor-gathering-filter-section">
        <select 
          className="vendor-gathering-filter-select"
          value={filter} 
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="ALL">전체</option>
          <option value="PENDING">승인 대기</option>
          <option value="APPROVED">승인됨</option>
          <option value="REJECTED">거절됨</option>
        </select>
        <span className="vendor-gathering-count">총 {filteredGatherings.length}개</span>
      </div>

      <table className="vendor-admin-table">
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
                <tr 
                  className="vendor-admin-table-row"
                  onClick={() => toggleRow(gathering.id)} 
                  style={{ cursor: 'pointer' }}
                >
                  <td>{gathering.title}</td>
                  <td>{gathering.category}</td>
                  <td>{gathering.price?.toLocaleString()}원</td>
                  <td>{gathering.location}</td>
                  <td>
                    <span className={`vendor-status-badge vendor-status-${gathering.status?.toLowerCase()}`}>
                      {gathering.status === 'PENDING' ? '대기' : 
                       gathering.status === 'APPROVED' ? '승인' : '거절'}
                    </span>
                  </td>
                  <td>{new Date(gathering.submittedAt).toLocaleDateString()}</td>
                  <td onClick={(e) => e.stopPropagation()}>
                    <div className="vendor-action-buttons">
                      {/* 승인/거절 버튼 (PENDING 상태일 때만) */}
                      {gathering.status === 'PENDING' && (
                        <>
                          <button 
                            className="vendor-btn vendor-btn-approve"
                            onClick={() => handleApprove(gathering.id)}
                            title="승인"
                          >
                            승인
                          </button>
                          <button 
                            className="vendor-btn vendor-btn-reject"
                            onClick={() => handleReject(gathering.id)}
                            title="거절"
                          >
                            거절
                          </button>
                        </>
                      )}
                      
                      {/* 삭제 버튼 (모든 상태에서 표시) */}
                      <button 
                        className="vendor-btn vendor-btn-delete"
                        onClick={() => handleDelete(gathering.id, gathering.title)}
                        title="삭제"
                        style={{ marginLeft: '4px' }}
                      >
                        🗑️ 삭제
                      </button>
                    </div>
                  </td>
                </tr>
                {expandedRows.has(gathering.id) && (
                  <tr className="vendor-detail-row">
                    <td colSpan="7">
                      <div className="vendor-detail-content">
                        <div className="vendor-detail-grid">
                          <div>
                            <div className="vendor-detail-item">
                              <div className="vendor-detail-label">설명</div>
                              <div className="vendor-detail-value">{gathering.description}</div>
                            </div>
                            <div className="vendor-detail-item">
                              <div className="vendor-detail-label">최대 참가자</div>
                              <div className="vendor-detail-value">{gathering.maxParticipants}명</div>
                            </div>
                            <div className="vendor-detail-item">
                              <div className="vendor-detail-label">준비물</div>
                              <div className="vendor-detail-value">{gathering.materials}</div>
                            </div>
                          </div>
                          <div>
                            <div className="vendor-detail-item">
                              <div className="vendor-detail-label">업체명</div>
                              <div className="vendor-detail-value">{gathering.vendorName}</div>
                            </div>
                            <div className="vendor-detail-item">
                              <div className="vendor-detail-label">연락처</div>
                              <div className="vendor-detail-value">{gathering.vendorContact}</div>
                            </div>
                            <div className="vendor-detail-item">
                              <div className="vendor-detail-label">이메일</div>
                              <div className="vendor-detail-value">{gathering.vendorEmail}</div>
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
              <td colSpan="7" className="vendor-empty-state">
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
  const [expandedRows, setExpandedRows] = useState(new Set());

  const handleStatusUpdate = async (reservationId, newStatus) => {
    try {
      console.log(`상태 변경 시도: 예약 ID ${reservationId}, 새 상태: ${newStatus}`);
      
      const response = await fetch(`/api/gatherings/vendor/admin/reservations/${reservationId}/status`, {
        method: 'PUT',
        credentials: 'include',
        headers: { 
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: newStatus })
      });
      
      if (response.ok) {
        const message = await response.text();
        console.log('응답 메시지:', message);
        alert('상태가 변경되었습니다.');
        onRefresh();
      } else if (response.status === 403) {
        alert('관리자 권한이 필요합니다.');
      } else if (response.status === 400) {
        const errorMessage = await response.text();
        alert(`잘못된 요청: ${errorMessage}`);
      } else {
        const errorMessage = await response.text();
        alert(`상태 변경에 실패했습니다: ${errorMessage}`);
        console.error('API 응답 에러:', response.status, errorMessage);
      }
    } catch (error) {
      console.error('상태 변경 실패:', error);
      alert('네트워크 오류로 상태 변경에 실패했습니다.');
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

  const getStatusText = (status) => {
    switch(status) {
      case 'PENDING': return '결제 대기';
      case 'PAID': return '결제 완료';
      case 'CONFIRMED': return '예약 확정';
      case 'COMPLETED': return '수강 완료';
      case 'CANCELLED': return '취소됨';
      case 'REFUNDED': return '환불됨';
      default: return status;
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'PENDING': return '#ffc107';
      case 'PAID': return '#59a9ffff';
      case 'CONFIRMED': return '#28a745';
      case 'COMPLETED': return '#6f42c1';
      case 'CANCELLED': return '#dc3545';
      case 'REFUNDED': return '#6c757d';
      default: return '#6c757d';
    }
  };

  const formatDateTime = (date, startTime) => {
    if (!date) return 'N/A';
    
    try {
      const dateStr = new Date(date).toLocaleDateString('ko-KR');
      const timeStr = startTime ? startTime : '';
      return timeStr ? `${dateStr} ${timeStr}` : dateStr;
    } catch (error) {
      return 'N/A';
    }
  };

  const filteredReservations = (reservations || []).filter(r => 
    filter === 'ALL' || r.status === filter
  );

  return (
    <div className="vendor-reservation-management">
      <div className="vendor-reservation-filter-section">
        <div className="vendor-reservation-filter-controls">
          <select 
            className="vendor-reservation-filter-select"
            value={filter} 
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="ALL">전체</option>
            <option value="PENDING">결제 대기</option>
            <option value="PAID">결제 완료</option>
            <option value="CONFIRMED">예약 확정</option>
            <option value="COMPLETED">수강 완료</option>
            <option value="CANCELLED">취소됨</option>
            <option value="REFUNDED">환불됨</option>
          </select>
          <span className="vendor-reservation-count-badge">총 {filteredReservations.length}개</span>
        </div>
      </div>

      <div className="vendor-reservation-table-container">
        <table className="vendor-admin-table">
          <thead>
            <tr>
              <th>예약 ID</th>
              <th>클래스명</th>
              <th>수업 일시</th>
              <th>참가자 수</th>
              <th>입금자명</th>
              <th>입금 은행</th>
              <th>상태</th>
              <th>작업</th>
            </tr>
          </thead>
          <tbody>
            {filteredReservations.length > 0 ? (
              filteredReservations.map(reservation => (
                <React.Fragment key={reservation.reservationId}>
                  <tr 
                    className={`vendor-admin-table-row ${expandedRows.has(reservation.reservationId) ? 'vendor-expanded' : ''}`}
                    onClick={() => toggleRow(reservation.reservationId)} 
                    style={{ cursor: 'pointer' }}
                  >
                    <td>
                      <strong>#{reservation.reservationId}</strong>
                    </td>
                    <td>
                      <div className="vendor-class-info">
                        <div className="vendor-class-title">{reservation.classTitle || '클래스명 없음'}</div>
                      </div>
                    </td>
                    <td>
                      <div className="vendor-datetime-info">
                        {formatDateTime(reservation.date, reservation.startTime)}
                      </div>
                    </td>
                    <td className="vendor-participant-count">
                      <strong>{reservation.participantCount || 1}명</strong>
                    </td>
                    <td>
                      <div className="vendor-payment-info">
                        <div className="vendor-payment-name">
                          {reservation.paymentName || 'N/A'}
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="vendor-bank-info">
                        {reservation.paymentBank || 'N/A'}
                      </div>
                    </td>
                    <td>
                      <span 
                        className="vendor-status-badge"
                        style={{ backgroundColor: getStatusColor(reservation.status) }}
                      >
                        {getStatusText(reservation.status)}
                      </span>
                    </td>
                    <td onClick={(e) => e.stopPropagation()}>
                      <div className="vendor-action-buttons">
                        {reservation.status === 'PENDING' && (
                          <button 
                            className="vendor-btn vendor-btn-approve"
                            onClick={() => handleStatusUpdate(reservation.reservationId, 'PAID')}
                            title="입금 확인"
                          >
                            입금 확인
                          </button>
                        )}
                        {reservation.status === 'PAID' && (
                          <button 
                            className="vendor-btn vendor-btn-confirm"
                            onClick={() => handleStatusUpdate(reservation.reservationId, 'CONFIRMED')}
                            title="예약 확정"
                          >
                            예약 확정
                          </button>
                        )}
                        {reservation.status === 'CONFIRMED' && (
                          <button 
                            className="vendor-btn vendor-btn-complete"
                            onClick={() => handleStatusUpdate(reservation.reservationId, 'COMPLETED')}
                            title="수강 완료"
                          >
                            수강 완료
                          </button>
                        )}
                        {(reservation.status === 'PENDING' || reservation.status === 'PAID') && (
                          <button 
                            className="vendor-btn vendor-btn-cancel"
                            onClick={() => {
                              if (window.confirm('정말 취소하시겠습니까?')) {
                                handleStatusUpdate(reservation.reservationId, 'CANCELLED');
                              }
                            }}
                            title="예약 취소"
                          >
                            취소
                          </button>
                        )}
                        {reservation.status === 'CANCELLED' && (
                          <button 
                            className="vendor-btn vendor-btn-refund"
                            onClick={() => {
                              if (window.confirm('환불 처리하시겠습니까?')) {
                                handleStatusUpdate(reservation.reservationId, 'REFUNDED');
                              }
                            }}
                            title="환불 처리"
                          >
                            환불
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                  
                  {/* 상세 정보 행 */}
                  {expandedRows.has(reservation.reservationId) && (
                    <tr className="vendor-detail-row">
                      <td colSpan="8">
                        <div className="vendor-detail-content">
                          <div className="vendor-detail-grid">
                            <div className="vendor-detail-section">
                              <h4>예약 상세 정보</h4>
                              <div className="vendor-detail-item">
                                <span className="vendor-detail-label">예약 ID:</span>
                                <span className="vendor-detail-value">#{reservation.reservationId}</span>
                              </div>
                              <div className="vendor-detail-item">
                                <span className="vendor-detail-label">클래스명:</span>
                                <span className="vendor-detail-value">{reservation.classTitle}</span>
                              </div>
                              <div className="vendor-detail-item">
                                <span className="vendor-detail-label">수업 날짜:</span>
                                <span className="vendor-detail-value">
                                  {reservation.date ? new Date(reservation.date).toLocaleDateString('ko-KR') : 'N/A'}
                                </span>
                              </div>
                              <div className="vendor-detail-item">
                                <span className="vendor-detail-label">수업 시간:</span>
                                <span className="vendor-detail-value">{reservation.startTime || 'N/A'}</span>
                              </div>
                            </div>
                            
                            <div className="vendor-detail-section">
                              <h4>결제 정보</h4>
                              <div className="vendor-detail-item">
                                <span className="vendor-detail-label">참가자 수:</span>
                                <span className="vendor-detail-value">{reservation.participantCount}명</span>
                              </div>
                              <div className="vendor-detail-item">
                                <span className="vendor-detail-label">입금자명:</span>
                                <span className="vendor-detail-value">{reservation.paymentName || 'N/A'}</span>
                              </div>
                              <div className="vendor-detail-item">
                                <span className="vendor-detail-label">입금 은행:</span>
                                <span className="vendor-detail-value">{reservation.paymentBank || 'N/A'}</span>
                              </div>
                              <div className="vendor-detail-item">
                                <span className="vendor-detail-label">현재 상태:</span>
                                <span className="vendor-detail-value">
                                  <span 
                                    className="vendor-status-badge"
                                    style={{ backgroundColor: getStatusColor(reservation.status) }}
                                  >
                                    {getStatusText(reservation.status)}
                                  </span>
                                </span>
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
                <td colSpan="8" className="vendor-empty-state">
                  <div>
                    {reservations && reservations.length === 0 ? 
                      '예약 데이터가 없습니다.' : 
                      '조건에 맞는 예약이 없습니다.'
                    }
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default VendorAdminPage;