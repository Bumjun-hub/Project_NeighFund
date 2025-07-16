import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Users, MapPin, CreditCard, User, Phone, Mail, CheckCircle, XCircle, ArrowLeft } from 'lucide-react';
import './VendorGatheringDetail.css';

const VendorGatheringDetail = ({ gatheringId, onBack }) => {
  const [gathering, setGathering] = useState(null);
  const [loading, setLoading] = useState(true);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [participantCount, setParticipantCount] = useState(1);
  const [paymentBank, setPaymentBank] = useState('');
  const [paymentName, setPaymentName] = useState('');
  const [showReservationForm, setShowReservationForm] = useState(false);

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

  // 실제 API에서 데이터 가져오기
  useEffect(() => {
    const fetchGatheringDetail = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/gatherings/vendor/detail/${gatheringId}`, {
          credentials: 'include', // 쿠키 포함
          headers: {
            'Content-Type': 'application/json'
          }
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch gathering details');
        }
        
        const data = await response.json();
        
        setGathering({
          id: data.id,
          title: data.title,
          description: data.content, 
          price: data.productPrice,
          maxParticipants: data.maxParticipants,
          duration: data.durationHours ? `${data.durationHours}시간` : "미정",
          location: data.dongName, 
          instructor: data.writerName || "강사명 미정",
          instructorPhone: data.writerPhone || "연락처 미정",
          instructorEmail: data.writerEmail || "이메일 미정",
          materials: data.materials || [], 
          
          // 이미지 처리 수정
          titleImage: data.titleImage, 
          productImages: data.productImages || [], 
          images: [
            data.titleImage, 
            ...(data.productImages || []).map(img => img.imageUrl || img) 
          ].filter(Boolean), 
          
          status: data.status,
          productName: data.productName,
          freeParking: data.freeParking,
          category: data.category,
          categoryKorean: getCategoryInKorean(data.category) 
        });
        
      } catch (error) {
        console.error('Error fetching gathering details:', error);
        setGathering(null);
      } finally {
        setLoading(false);
      }
    };

    if (gatheringId) {
      fetchGatheringDetail();
    }
  }, [gatheringId]);

  // 예약 가능한 시간대 생성 (샘플)
  const generateAvailableSlots = (date) => {
    const slots = [];
    const startHour = 10;
    const endHour = 18;
    
    for (let hour = startHour; hour < endHour; hour++) {
      slots.push({
        time: `${hour.toString().padStart(2, '0')}:00`,
        available: Math.random() > 0.3, // 랜덤으로 예약 가능 여부
        currentParticipants: Math.floor(Math.random() * 4)
      });
    }
    return slots;
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
    setAvailableSlots(generateAvailableSlots(date));
    setSelectedTime('');
  };

  const handleReservation = async () => {
    if (!selectedDate || !selectedTime || !paymentBank || !paymentName) {
      alert('모든 필드를 입력해주세요.');
      return;
    }

    // endTime 계산 (1시간 후)
    const startTimeDate = new Date(`2000-01-01T${selectedTime}:00`);
    const endTimeDate = new Date(startTimeDate.getTime() + (60 * 60 * 1000)); // 1시간 추가
    const endTimeString = endTimeDate.toTimeString().substr(0, 5); // HH:MM 형식

    const reservationData = {
      gatheringId: gathering.id,
      date: selectedDate,
      startTime: selectedTime,
      endTime: endTimeString, // endTime 추가
      participantCount,
      paymentBank,
      paymentName
    };

    try {
      const response = await fetch(`/api/gatherings/vendor/reservation/${gatheringId}`, {
        method: 'POST',
        credentials: 'include', // 쿠키 포함
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(reservationData)
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || '예약 처리 중 오류가 발생했습니다.');
      }
      
      const result = await response.text();
      alert(result); // "원데이클래스가 예약되었습니다." 메시지
      setShowReservationForm(false);
      
      // 폼 초기화
      setSelectedDate('');
      setSelectedTime('');
      setParticipantCount(1);
      setPaymentBank('');
      setPaymentName('');
    } catch (error) {
      console.error('Reservation error:', error);
      
      // 에러 메시지 파싱
      let errorMessage = '예약 중 오류가 발생했습니다.';
      try {
        const errorObj = JSON.parse(error.message);
        errorMessage = errorObj.message || errorMessage;
      } catch (parseError) {
        // JSON 파싱 실패시 원본 메시지 사용
        errorMessage = error.message || errorMessage;
      }
      
      alert(errorMessage);
    }
  };

  if (loading) {
    return (
      <div className="vendor-detail-loading">
        <div className="vendor-detail-loading-content">
          <div className="vendor-detail-loading-image"></div>
          <div className="vendor-detail-loading-text">
            <div className="vendor-detail-loading-line title"></div>
            <div className="vendor-detail-loading-line meta"></div>
            <div className="vendor-detail-loading-line description"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!gathering) {
    return (
      <div className="vendor-detail-error">
        <XCircle className="vendor-detail-error-icon" />
        <p className="vendor-detail-error-text">클래스 정보를 불러올 수 없습니다.</p>
      </div>
    );
  }

  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="vendor-detail-container">
      {/* 헤더 */}
      <div className="vendor-detail-header">
        <h1 className="vendor-detail-title">{gathering.title}</h1>
        <div className="vendor-detail-meta">
          <div className="vendor-detail-meta-item">
            <MapPin className="vendor-detail-meta-icon" />
            <span>{gathering.location}</span>
          </div>
          <div className="vendor-detail-meta-item">
            <Clock className="vendor-detail-meta-icon" />
            <span>{gathering.duration}</span>
          </div>
          <div className="vendor-detail-meta-item">
            <Users className="vendor-detail-meta-icon" />
            <span>최대 {gathering.maxParticipants}명</span>
          </div>
        </div>
      </div>

      {/* 메인 이미지 (titleImage) */}
      {gathering.titleImage && (
        <div className="vendor-detail-main-image">
          <img 
            src={gathering.titleImage} 
            alt={gathering.title}
            className="vendor-detail-image"
            onError={(e) => {
              console.error('메인 이미지 로드 실패:', gathering.titleImage);
              e.target.style.display = 'none';
            }}
          />
        </div>
      )}

      {/* 추가 이미지들 (productImages) */}
      {gathering.productImages && gathering.productImages.length > 0 && (
        <div className="vendor-detail-gallery">
          <h3 className="vendor-detail-section-title">추가 이미지</h3>
          <div className="vendor-detail-gallery-grid">
            {gathering.productImages.map((image, index) => (
              <div key={index}>
                <img 
                  src={image.imageUrl || image} 
                  alt={`추가 이미지 ${index + 1}`}
                  className="vendor-detail-image"
                  onError={(e) => {
                    console.error('추가 이미지 로드 실패:', image);
                    e.target.style.display = 'none';
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="vendor-detail-layout">
        {/* 메인 정보 */}
        <div className="vendor-detail-main">
          {/* 클래스 설명 */}
          <section className="vendor-detail-section">
            <h2 className="vendor-detail-section-title">클래스 소개</h2>
            <p className="vendor-detail-description">{gathering.description}</p>
          </section>

          {/* 클래스 정보 */}
          <section className="vendor-detail-section">
            <h2 className="vendor-detail-section-title">클래스 정보</h2>
            <div className="vendor-detail-info-box">
              <div className="vendor-detail-info-item">
                <span className="vendor-detail-info-label">상품명:</span>
                <span className="vendor-detail-info-value">{gathering.productName}</span>
              </div>
              <div className="vendor-detail-info-item">
                <span className="vendor-detail-info-label">카테고리:</span>
                <span className="vendor-detail-info-value">{gathering.categoryKorean}</span>
              </div>
              <div className="vendor-detail-info-item">
                <span className="vendor-detail-info-label">수업 시간:</span>
                <span className="vendor-detail-info-value">{gathering.duration}</span>
              </div>
              <div className="vendor-detail-info-item">
                <span className="vendor-detail-info-label">무료 주차:</span>
                <span className="vendor-detail-info-value">{gathering.freeParking === 'true' ? '가능' : '불가능'}</span>
              </div>
              <div className="vendor-detail-info-item">
                <span className="vendor-detail-info-label">최대 인원:</span>
                <span className="vendor-detail-info-value">{gathering.maxParticipants}명</span>
              </div>
            </div>
          </section>

          {/* 강사 정보 */}
          <section className="vendor-detail-section">
            <h2 className="vendor-detail-section-title">강사 정보</h2>
            <div className="vendor-detail-instructor">
              <div className="vendor-detail-instructor-header">
                <User className="vendor-detail-instructor-icon" />
                <div>
                  <h3 className="vendor-detail-instructor-name">{gathering.instructor}</h3>
                  <p className="vendor-detail-instructor-role">원데이클래스 강사</p>
                </div>
              </div>
              <div className="vendor-detail-instructor-contact">
                <div className="vendor-detail-contact-item">
                  <Phone className="vendor-detail-contact-icon" />
                  <span className="vendor-detail-contact-text">{gathering.instructorPhone}</span>
                </div>
                <div className="vendor-detail-contact-item">
                  <Mail className="vendor-detail-contact-icon" />
                  <span className="vendor-detail-contact-text">{gathering.instructorEmail}</span>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* 예약 사이드바 */}
        <div className="vendor-detail-reservation-sidebar">
          <div className="vendor-detail-reservation-card">
            <div className="vendor-detail-price-section">
              <div className="vendor-detail-price">
                {gathering.price.toLocaleString()}원
              </div>
              <div className="vendor-detail-price-unit">1인 기준</div>
            </div>

            {!showReservationForm ? (
              <button
                onClick={() => setShowReservationForm(true)}
                className="vendor-detail-reservation-btn"
              >
                예약하기
              </button>
            ) : (
              <div className="vendor-detail-reservation-form">
                <h3 className="vendor-detail-form-title">예약 정보</h3>
                
                {/* 날짜 선택 */}
                <div className="vendor-detail-form-group">
                  <label className="vendor-detail-form-label">
                    <Calendar className="vendor-detail-form-label-icon" />
                    날짜 선택
                  </label>
                  <input
                    type="date"
                    value={selectedDate}
                    min={today}
                    onChange={(e) => handleDateChange(e.target.value)}
                    className="vendor-detail-form-input"
                  />
                </div>

                {/* 시간 선택 */}
                {selectedDate && (
                  <div className="vendor-detail-form-group">
                    <label className="vendor-detail-form-label">
                      <Clock className="vendor-detail-form-label-icon" />
                      시간 선택
                    </label>
                    <div className="vendor-detail-time-grid">
                      {availableSlots.map((slot, index) => (
                        <button
                          key={index}
                          onClick={() => setSelectedTime(slot.time)}
                          disabled={!slot.available}
                          className={`vendor-detail-time-slot ${
                            selectedTime === slot.time
                              ? 'selected'
                              : slot.available
                              ? 'available'
                              : 'unavailable'
                          }`}
                        >
                          {slot.time}
                          {slot.available && (
                            <div className="vendor-detail-time-info">
                              {slot.currentParticipants}/{gathering.maxParticipants}
                            </div>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* 인원 선택 */}
                <div className="vendor-detail-form-group">
                  <label className="vendor-detail-form-label">
                    <Users className="vendor-detail-form-label-icon" />
                    참가 인원
                  </label>
                  <select
                    value={participantCount}
                    onChange={(e) => setParticipantCount(parseInt(e.target.value))}
                    className="vendor-detail-form-select"
                  >
                    {[1, 2, 3, 4, 5, 6].map(num => (
                      <option key={num} value={num}>{num}명</option>
                    ))}
                  </select>
                </div>

                {/* 결제 정보 */}
                <div className="vendor-detail-form-group">
                  <label className="vendor-detail-form-label">
                    <CreditCard className="vendor-detail-form-label-icon" />
                    입금 은행
                  </label>
                  <input
                    type="text"
                    value={paymentBank}
                    onChange={(e) => setPaymentBank(e.target.value)}
                    className="vendor-detail-form-input"
                    />
                </div>

                <div className="vendor-detail-form-group">
                  <label className="vendor-detail-form-label">
                    입금자명
                  </label>
                  <input
                    type="text"
                    value={paymentName}
                    onChange={(e) => setPaymentName(e.target.value)}
                    placeholder="입금자명을 입력하세요"
                    className="vendor-detail-form-input"
                  />
                </div>

                {/* 총 금액 */}
                <div className="vendor-detail-total-box">
                  <div className="vendor-detail-total">
                    <span>총 금액</span>
                    <span className="vendor-detail-total-amount">
                      {(gathering.price * participantCount).toLocaleString()}원
                    </span>
                  </div>
                </div>

                {/* 버튼들 */}
                <div className="vendor-detail-button-group">
                  <button
                    onClick={() => setShowReservationForm(false)}
                    className="vendor-detail-btn-secondary"
                  >
                    취소
                  </button>
                  <button
                    onClick={handleReservation}
                    className="vendor-detail-btn-primary"
                  >
                    예약 신청
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VendorGatheringDetail;