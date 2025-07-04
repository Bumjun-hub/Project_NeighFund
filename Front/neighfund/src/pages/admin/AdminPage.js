import React, { useState, useEffect } from 'react';
import './AdminPage.css';

const AdminPage = () => {
  const [unapprovedFunds, setUnapprovedFunds] = useState([]);
  const [approvedFunds, setApprovedFunds] = useState([]);
  const [selectedFund, setSelectedFund] = useState(null);
  const [mode, setMode] = useState('unapproved'); // 'unapproved' | 'approved'

  // ✅ 전체 펀딩 불러오기
  const fetchFunds = async () => {
    try {
      const [res1, res2] = await Promise.all([
        fetch('/api/fund/admin/unapproved'),
        fetch('/api/fund/view'),
      ]);

      const unapproved = await res1.json();
      const approved = await res2.json();

      setUnapprovedFunds(unapproved);
      setApprovedFunds(approved);
    } catch (err) {
      alert('펀딩 목록 조회 실패');
    }
  };

  useEffect(() => {
    fetchFunds();
  }, []);

  // ✅ 상세 보기 (mode에 따라 분기)
  const handleSelectFund = async (fund) => {
    setSelectedFund(null);

    const endpoint =
      mode === 'unapproved'
        ? `/api/fund/admin/unapproved/${fund.id}`
        : `/api/fund/view/${fund.id}`;

    try {
      const res = await fetch(endpoint);
      if (!res.ok) throw new Error();
      const detail = await res.json();
      setSelectedFund(detail);
    } catch (err) {
      alert('상세 정보 조회 실패');
    }
  };

  // ✅ 승인 처리
  const handleApprove = async (fundId) => {
    try {
      const res = await fetch(`/api/fund/admin/approve/${fundId}`, {
        method: 'PUT',
      });
      if (!res.ok) throw new Error();
      alert('승인 완료!');
      await fetchFunds();
      setSelectedFund(null);
    } catch (err) {
      alert('승인 실패');
    }
  };

  const fundsToShow = mode === 'unapproved' ? unapprovedFunds : approvedFunds;

  return (
    <div className="fund-admin">
      <h2>🔧 펀딩 관리자 페이지</h2>

      <div className="tab-buttons">
        <button
          className={mode === 'unapproved' ? 'active' : ''}
          onClick={() => {
            setMode('unapproved');
            setSelectedFund(null);
          }}
        >
          📝 미승인 펀딩
        </button>

        <button
          className={mode === 'approved' ? 'active' : ''}
          onClick={() => {
            setMode('approved');
            setSelectedFund(null);
          }}
        >
          ✅ 승인된 펀딩
        </button>
      </div>

      <div className="fund-list">
        <h3>{mode === 'unapproved' ? '📋 미승인 목록' : '📦 승인된 목록'}</h3>
        <ul>
          {fundsToShow.map((f) => (
            <li key={f.id} onClick={() => handleSelectFund(f)}>
              <img
                src={f.fundImages?.[0] || f.imageUrl}
                alt="썸네일"
                width="80"
                height="60"
              />
              <span style={{ marginLeft: 10 }}>
                <strong>{f.title}</strong> ({f.fundStatus})
              </span>
            </li>
          ))}
        </ul>
      </div>

      {selectedFund && (
        <div className="fund-detail">
          <h3>📌 상세 정보</h3>
          <p><strong>제목:</strong> {selectedFund.title}</p>
          <p><strong>작성자:</strong> {selectedFund.username}</p>
          <p><strong>상태:</strong> {selectedFund.fundStatus}</p>
          <p><strong>마감일:</strong> {selectedFund.deadline?.split('T')[0]}</p>
          <p><strong>참여자 수:</strong> {selectedFund.currentParticipants}</p>
          <p><strong>목표 금액:</strong> {selectedFund.targetAmount?.toLocaleString()}원</p>
          <p><strong>현재 금액:</strong> {selectedFund.currentAmount?.toLocaleString()}원</p>

          <h4>📸 대표 이미지</h4>
          {selectedFund.fundImages?.map((url, i) => (
            <img key={i} src={url} alt={`img-${i}`} style={{ width: 150, marginRight: 8 }} />
          ))}

          <h4>🖼 상세 이미지</h4>
          {selectedFund.contentImgUrls?.map((url, i) => (
            <img key={i} src={url} alt={`content-${i}`} style={{ width: 150, marginRight: 8 }} />
          ))}

          <h4>🎁 리워드 목록</h4>
          <ul>
            {selectedFund.options?.map((opt) => (
              <li key={opt.id}>
                <strong>{opt.title}</strong> - {opt.price.toLocaleString()}원 / 재고: {opt.quantity}
                <p>{opt.description}</p>
              </li>
            ))}
          </ul>

          {mode === 'unapproved' && (
            <button onClick={() => handleApprove(selectedFund.id)}>✅ 승인하기</button>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminPage;
