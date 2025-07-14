import React, { useState, useEffect } from 'react';
import { Search, Eye, Check, X, Calendar, User, MapPin, Clock, DollarSign, Users, Filter, RefreshCw } from 'lucide-react';
import './VendorAdminPage.css';

const VendorAdminPage = () => {
  const [vendorGatherings, setVendorGatherings] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [activeTab, setActiveTab] = useState('gatherings');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [selectedGathering, setSelectedGathering] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // 백엔드 API URL 수정
  const API_BASE_URL = 'http://localhost:8080/api/gatherings/vendor';

  // 쿠키 기반 인증용 API 호출 함수
  const apiCall = async (url, options = {}) => {
    try {
      console.log('🔄 API 호출:', url);
      const response = await fetch(url, {
        credentials: 'include', // 쿠키 자동 포함
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      console.log('📡 응답 상태:', response.status);

      if (response.status === 401) {
        console.error('🚫 인증 실패 - 토큰 갱신 시도');
        
        // 토큰 갱신 시도
        const refreshResult = await refreshToken();
        
        if (refreshResult) {
          // 토큰 갱신 성공 시 원래 요청 재시도
          const retryResponse = await fetch(url, {
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json',
              ...options.headers,
            },
            ...options,
          });
          
          if (retryResponse.ok) {
            const contentType = retryResponse.headers.get('content-type');
            if (contentType && contentType.includes('application/json')) {
              const data = await retryResponse.json();
              console.log('✅ API 재시도 성공:', data);
              return data;
            } else {
              const text = await retryResponse.text();
              console.log('✅ API 재시도 성공 (텍스트):', text);
              return text;
            }
          }
        }
        
        // 토큰 갱신 실패 시 로그인 페이지로 이동
        alert('인증이 만료되었습니다. 다시 로그인해주세요.');
        window.location.href = '/login';
        throw new Error('인증이 만료되었습니다.');
      }

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ API 에러:', response.status, errorText);
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const data = await response.json();
        console.log('✅ API 응답 데이터:', data);
        return data;
      } else {
        const text = await response.text();
        console.log('✅ API 응답 텍스트:', text);
        return text;
      }
    } catch (error) {
      console.error('💥 API 호출 실패:', error);
      throw error;
    }
  };

  // 토큰 갱신 함수
  const refreshToken = async () => {
    try {
      console.log('🔄 토큰 갱신 시도');
      
      const response = await fetch('http://localhost:8080/api/auth/refresh', {
        method: 'POST',
        credentials: 'include',
      });

      console.log('🔄 토큰 갱신 응답:', response.status);

      if (response.ok) {
        console.log('✅ 토큰 갱신 성공');
        return true;
      } else {
        console.log('❌ 토큰 갱신 실패');
        return false;
      }
    } catch (error) {
      console.error('💥 토큰 갱신 오류:', error);
      return false;
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      console.log('📊 데이터 로딩 시작...');
      
      // 예약 목록 조회
      try {
        const reservationsData = await apiCall(`${API_BASE_URL}/admin/reservations`);
        setReservations(reservationsData || []);
        console.log('✅ 예약 데이터 로딩 성공:', reservationsData);
      } catch (error) {
        console.error('❌ 예약 데이터 로딩 실패:', error);
        setReservations([]);
      }

      // 벤더 개더링 목록 조회 (실제 API 호출)
      try {
        const gatheringsData = await apiCall(`${API_BASE_URL}/admin/vendor-gatherings`);
        setVendorGatherings(gatheringsData || []);
        console.log('✅ 벤더 개더링 데이터 로딩 성공:', gatheringsData);
      } catch (error) {
        console.error('❌ 벤더 개더링 데이터 로딩 실패:', error);
        // 실패 시 임시 데이터 사용
        const mockVendorGatherings = [
          {
            id: 1,
            title: '홈베이킹 마카롱 클래스',
            description: '프랑스 정통 마카롱 만들기를 배우는 원데이클래스입니다.',
            category: '쿠킹',
            maxParticipants: 8,
            duration: 180,
            price: 45000,
            location: '서울시 강남구 역삼동',
            vendorName: '김미영',
            vendorContact: '010-1234-5678',
            vendorEmail: 'kimmy@example.com',
            materials: '밀가루, 아몬드파우더, 설탕, 식용색소',
            requirements: '앞치마 개인 지참',
            status: 'PENDING',
            submittedAt: '2025-07-10T09:30:00',
            vendorExperience: '제과제빵 자격증 보유, 3년 경력'
          }
        ];
        setVendorGatherings(mockVendorGatherings);
      }

    } catch (error) {
      console.error('💥 데이터 로딩 전체 실패:', error);
      if (error.message.includes('인증')) {
        return; // 이미 로그인 페이지로 리다이렉트됨
      }
      alert('데이터를 불러오는데 실패했습니다: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  // 클래스 승인 처리
  const handleApproveGathering = async (id) => {
    try {
      console.log('🟢 클래스 승인:', id);
      
      await apiCall(`${API_BASE_URL}/admin/vendor-gatherings/${id}/approve`, {
        method: 'PUT',
      });
      
      // 로컬 상태 업데이트
      setVendorGatherings(prev => prev.map(gathering => 
        gathering.id === id ? { ...gathering, status: 'APPROVED' } : gathering
      ));
      
      alert('원데이클래스가 승인되었습니다.');
      
    } catch (error) {
      console.error('❌ 승인 처리 실패:', error);
      alert('승인 처리 중 오류가 발생했습니다: ' + error.message);
    }
  };

  // 클래스 거절 처리
  const handleRejectGathering = async (id) => {
    try {
      console.log('🔴 클래스 거절:', id);
      
      await apiCall(`${API_BASE_URL}/admin/vendor-gatherings/${id}/reject`, {
        method: 'PUT',
      });
      
      // 로컬 상태 업데이트
      setVendorGatherings(prev => prev.map(gathering => 
        gathering.id === id ? { ...gathering, status: 'REJECTED' } : gathering
      ));
      
      alert('원데이클래스가 거절되었습니다.');
      
    } catch (error) {
      console.error('❌ 거절 처리 실패:', error);
      alert('거절 처리 중 오류가 발생했습니다: ' + error.message);
    }
  };

  // 예약 상태 변경
  const handleUpdateReservationStatus = async (reservationId, newStatus) => {
    try {
      console.log('🔄 예약 상태 변경:', reservationId, newStatus);
      
      await apiCall(`${API_BASE_URL}/admin/${reservationId}/status?status=${newStatus}`, {
        method: 'PUT',
      });
      
      // 로컬 상태 업데이트
      setReservations(prev => prev.map(res => 
        res.reservationId === reservationId ? { ...res, status: newStatus } : res
      ));
      
      const statusText = {
        'CONFIRMED': '입금확인',
        'CANCELLED': '취소됨'
      };
      alert(`예약 상태가 ${statusText[newStatus] || newStatus}로 변경되었습니다.`);
    } catch (error) {
      console.error('❌ 상태 변경 실패:', error);
      alert('상태 변경 중 오류가 발생했습니다: ' + error.message);
    }
  };

  const filteredGatherings = vendorGatherings.filter(gathering => {
    const matchesSearch = gathering.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         gathering.vendorName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || gathering.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status) => {
    const statusConfig = {
      PENDING: { class: 'status-pending-Reservation', text: '승인대기' },
      APPROVED: { class: 'status-approved-Reservation', text: '승인됨' },
      REJECTED: { class: 'status-rejected-Reservation', text: '거절됨' },
      CONFIRMED: { class: 'status-confirmed-Reservation', text: '입금확인' },
      CANCELLED: { class: 'status-cancelled-Reservation', text: '취소됨' }
    };
    
    const config = statusConfig[status] || statusConfig.PENDING;
    return (
      <span className={`status-badge-Reservation ${config.class}`}>
        {config.text}
      </span>
    );
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    
    if (Array.isArray(dateString)) {
      const [year, month, day] = dateString;
      return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    }
    
    try {
      return new Date(dateString).toLocaleDateString('ko-KR');
    } catch {
      return dateString;
    }
  };

  const formatTime = (timeString) => {
    if (!timeString) return '';
    
    if (Array.isArray(timeString)) {
      const [hour, minute] = timeString;
      return `${String(hour).padStart(2, '0')}:${String(minute || 0).padStart(2, '0')}`;
    }
    
    return timeString;
  };

  const formatDateTime = (dateTimeString) => {
    if (!dateTimeString) return '';
    
    try {
      const date = new Date(dateTimeString);
      return date.toLocaleString('ko-KR');
    } catch (error) {
      return dateTimeString;
    }
  };

  const DetailModal = ({ gathering, onClose }) => (
    <div className="modal-overlay-Reservation">
      <div className="modal-content-Reservation">
        <div className="modal-header-Reservation">
          <h2 className="modal-title-Reservation">클래스 상세 정보</h2>
          <button onClick={onClose} className="modal-close-Reservation">
            <X size={24} />
          </button>
        </div>
        
        <div className="modal-body-Reservation">
          <div className="detail-grid-Reservation">
            <div className="detail-section-Reservation">
              <h3 className="section-title-Reservation">강사 정보</h3>
              <div className="section-content-Reservation">
                <p><span className="label-Reservation">이름:</span> {gathering.vendorName}</p>
                <p><span className="label-Reservation">이메일:</span> {gathering.vendorEmail}</p>
                <p><span className="label-Reservation">연락처:</span> {gathering.vendorContact}</p>
              </div>
            </div>
            
            <div className="detail-section-Reservation">
              <h3 className="section-title-Reservation">클래스 기본 정보</h3>
              <div className="section-content-Reservation">
                <p><span className="label-Reservation">클래스명:</span> {gathering.title}</p>
                <p><span className="label-Reservation">카테고리:</span> {gathering.category}</p>
                <p><span className="label-Reservation">최대 정원:</span> {gathering.maxParticipants}명</p>
                <p><span className="label-Reservation">소요시간:</span> {gathering.duration}분</p>
                <p><span className="label-Reservation">가격:</span> {gathering.price?.toLocaleString()}원</p>
              </div>
            </div>
          </div>
          
          <div className="detail-section-full-Reservation">
            <h3 className="section-title-Reservation">클래스 설명</h3>
            <p className="description-Reservation">{gathering.description}</p>
          </div>
          
          <div className="detail-grid-Reservation">
            <div className="detail-section-Reservation">
              <h3 className="section-title-Reservation">장소</h3>
              <p className="location-Reservation">{gathering.location}</p>
            </div>
            
            <div className="detail-section-Reservation">
              <h3 className="section-title-Reservation">제공 재료 및 준비물</h3>
              <p className="materials-Reservation">{gathering.materials}</p>
              {gathering.requirements && (
                <p><span className="label-Reservation">준비사항:</span> {gathering.requirements}</p>
              )}
            </div>
          </div>
          
          {gathering.vendorExperience && (
            <div className="detail-section-full-Reservation">
              <h3 className="section-title-Reservation">강사 경력 및 자격</h3>
              <p className="experience-Reservation">{gathering.vendorExperience}</p>
            </div>
          )}
          
          <div className="modal-footer-Reservation">
            <div className="footer-info-Reservation">
              <p className="submission-date-Reservation">
                신청일: {formatDateTime(gathering.submittedAt)}
              </p>
              <div className="status-info-Reservation">
                <span>상태:</span>
                {getStatusBadge(gathering.status)}
              </div>
            </div>
            
            {gathering.status === 'PENDING' && (
              <div className="action-buttons-Reservation">
                <button
                  onClick={() => {
                    handleRejectGathering(gathering.id);
                    onClose();
                  }}
                  className="btn-reject-Reservation"
                >
                  <X size={16} />
                  <span>거절</span>
                </button>
                <button
                  onClick={() => {
                    handleApproveGathering(gathering.id);
                    onClose();
                  }}
                  className="btn-approve-Reservation"
                >
                  <Check size={16} />
                  <span>승인</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="container-Reservation">
      <div className="header-Reservation">
        <div className="header-content-Reservation">
          <div className="header-left-Reservation">
            <h1 className="page-title-Reservation">원데이클래스 관리자</h1>
            <p className="page-subtitle-Reservation">클래스 개설 신청 및 예약 관리</p>
          </div>
          <button
            onClick={loadData}
            className="refresh-btn-Reservation"
            disabled={loading}
          >
            <RefreshCw size={16} className={loading ? 'spinning-Reservation' : ''} />
            <span>새로고침</span>
          </button>
        </div>
      </div>

      <div className="main-content-Reservation">
        <div className="tabs-Reservation">
          <nav className="tab-nav-Reservation">
            <button
              onClick={() => setActiveTab('gatherings')}
              className={`tab-button-Reservation ${activeTab === 'gatherings' ? 'active-Reservation' : ''}`}
            >
              클래스 개설 신청
              <span className="tab-badge-Reservation">
                {vendorGatherings.filter(g => g.status === 'PENDING').length}
              </span>
            </button>
            <button
              onClick={() => setActiveTab('reservations')}
              className={`tab-button-Reservation ${activeTab === 'reservations' ? 'active-Reservation' : ''}`}
            >
              예약 관리
              <span className="tab-badge-Reservation">
                {reservations.filter(r => r.status === 'PENDING').length}
              </span>
            </button>
          </nav>
        </div>

        {activeTab === 'gatherings' && (
          <div>
            <div className="search-section-Reservation">
              <div className="search-container-Reservation">
                <div className="search-input-wrapper-Reservation">
                  <Search className="search-icon-Reservation" size={20} />
                  <input
                    type="text"
                    placeholder="클래스명 또는 강사명으로 검색..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="search-input-Reservation"
                  />
                </div>
                <div className="filter-wrapper-Reservation">
                  <Filter size={20} className="filter-icon-Reservation" />
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="filter-select-Reservation"
                  >
                    <option value="ALL">전체 상태</option>
                    <option value="PENDING">승인대기</option>
                    <option value="APPROVED">승인됨</option>
                    <option value="REJECTED">거절됨</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="table-container-Reservation">
              <div className="table-header-Reservation">
                <h2 className="table-title-Reservation">클래스 개설 신청 목록</h2>
              </div>
              <div className="table-wrapper-Reservation">
                <table className="data-table-Reservation">
                  <thead className="table-head-Reservation">
                    <tr>
                      <th className="table-th-Reservation">클래스 정보</th>
                      <th className="table-th-Reservation">강사</th>
                      <th className="table-th-Reservation">상세 정보</th>
                      <th className="table-th-Reservation">상태</th>
                      <th className="table-th-Reservation">작업</th>
                    </tr>
                  </thead>
                  <tbody className="table-body-Reservation">
                    {filteredGatherings.map((gathering) => (
                      <tr key={gathering.id} className="table-row-Reservation">
                        <td className="table-td-Reservation">
                          <div className="class-info-Reservation">
                            <div className="class-title-Reservation">{gathering.title}</div>
                            <div className="class-category-Reservation">{gathering.category}</div>
                            <div className="class-details-Reservation">
                              <Users size={12} />
                              최대 {gathering.maxParticipants}명
                              <Clock size={12} />
                              {gathering.duration}분
                              <DollarSign size={12} />
                              {gathering.price?.toLocaleString()}원
                            </div>
                          </div>
                        </td>
                        <td className="table-td-Reservation">
                          <div className="vendor-name-Reservation">{gathering.vendorName}</div>
                          <div className="vendor-email-Reservation">{gathering.vendorEmail}</div>
                          <div className="vendor-contact-Reservation">{gathering.vendorContact}</div>
                        </td>
                        <td className="table-td-Reservation">
                          <div className="location-info-Reservation">
                            <MapPin size={12} />
                            <span className="location-text-Reservation">{gathering.location}</span>
                          </div>
                          <div className="submission-info-Reservation">
                            신청일: {formatDateTime(gathering.submittedAt)}
                          </div>
                        </td>
                        <td className="table-td-Reservation">
                          {getStatusBadge(gathering.status)}
                        </td>
                        <td className="table-td-Reservation">
                          <div className="action-buttons-table-Reservation">
                            <button
                              onClick={() => {
                                setSelectedGathering(gathering);
                                setIsDetailModalOpen(true);
                              }}
                              className="action-btn-view-Reservation"
                              title="상세보기"
                            >
                              <Eye size={16} />
                            </button>
                            {gathering.status === 'PENDING' && (
                              <>
                                <button
                                  onClick={() => handleApproveGathering(gathering.id)}
                                  className="action-btn-approve-Reservation"
                                  title="승인"
                                >
                                  <Check size={16} />
                                </button>
                                <button
                                  onClick={() => handleRejectGathering(gathering.id)}
                                  className="action-btn-reject-Reservation"
                                  title="거절"
                                >
                                  <X size={16} />
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                
                {filteredGatherings.length === 0 && (
                  <div className="empty-state-Reservation">
                    {searchTerm || statusFilter !== 'ALL' 
                      ? '검색 조건에 맞는 클래스가 없습니다.' 
                      : '등록된 클래스 신청이 없습니다.'
                    }
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'reservations' && (
          <div>
            <div className="table-container-Reservation">
              <div className="table-header-Reservation">
                <h2 className="table-title-Reservation">예약 관리</h2>
                <p className="table-subtitle-Reservation">승인된 클래스의 예약 현황을 관리합니다.</p>
              </div>
              <div className="table-wrapper-Reservation">
                <table className="data-table-Reservation">
                  <thead className="table-head-Reservation">
                    <tr>
                      <th className="table-th-Reservation">예약 ID</th>
                      <th className="table-th-Reservation">클래스명</th>
                      <th className="table-th-Reservation">예약 일정</th>
                      <th className="table-th-Reservation">예약자 정보</th>
                      <th className="table-th-Reservation">상태</th>
                      <th className="table-th-Reservation">작업</th>
                    </tr>
                  </thead>
                  <tbody className="table-body-Reservation">
                    {reservations.map((reservation) => (
                      <tr key={reservation.reservationId} className="table-row-Reservation">
                        <td className="table-td-Reservation">
                          <div className="reservation-id-Reservation">#{reservation.reservationId}</div>
                        </td>
                        <td className="table-td-Reservation">
                          <div className="class-title-Reservation">{reservation.classTitle}</div>
                          <div className="participant-count-Reservation">
                            {reservation.participantCount}명 참가
                          </div>
                        </td>
                        <td className="table-td-Reservation">
                          <div className="schedule-info-Reservation">
                            <Calendar size={12} />
                            {formatDate(reservation.date)}
                          </div>
                          <div className="time-info-Reservation">
                            <Clock size={12} />
                            {formatTime(reservation.startTime)}
                          </div>
                        </td>
                        <td className="table-td-Reservation">
                          <div className="customer-name-Reservation">{reservation.paymentName}</div>
                          <div className="payment-bank-Reservation">{reservation.paymentBank}</div>
                        </td>
                        <td className="table-td-Reservation">
                          {getStatusBadge(reservation.status)}
                        </td>
                        <td className="table-td-Reservation">
                          <div className="reservation-actions-Reservation">
                            {reservation.status === 'PENDING' && (
                              <button
                                onClick={() => handleUpdateReservationStatus(reservation.reservationId, 'CONFIRMED')}
                                className="btn-confirm-Reservation"
                              >
                                입금 확인
                              </button>
                            )}
                            {reservation.status !== 'CANCELLED' && (
                              <button
                                onClick={() => handleUpdateReservationStatus(reservation.reservationId, 'CANCELLED')}
                                className="btn-cancel-Reservation"
                              >
                                취소
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                
                {reservations.length === 0 && (
                  <div className="empty-state-Reservation">
                    예약 내역이 없습니다.
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {isDetailModalOpen && selectedGathering && (
        <DetailModal
          gathering={selectedGathering}
          onClose={() => {
            setIsDetailModalOpen(false);
            setSelectedGathering(null);
          }}
        />
      )}
    </div>
  );
};

export default VendorAdminPage;