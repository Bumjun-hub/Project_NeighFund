import React, { useState, useEffect } from 'react';
import './AdminPage.css';

const AdminPage = () => {
  const [unapprovedFunds, setUnapprovedFunds] = useState([]);
  const [approvedFunds, setApprovedFunds] = useState([]);
  const [selectedFund, setSelectedFund] = useState(null);
  const [communityPosts, setCommunityPosts] = useState([]);
  const [activeTab, setActiveTab] = useState('fund'); // 'fund' | 'community'
  const [fundMode, setFundMode] = useState('unapproved'); // 'unapproved' | 'approved'

  useEffect(() => {
    fetchFunds();
    fetchCommunityPosts();
  }, []);

  const fetchFunds = async () => {
    try {
      const [res1, res2] = await Promise.all([
        fetch('/api/fund/admin/unapproved'),
        fetch('/api/fund/view'),
      ]);
      setUnapprovedFunds(await res1.json());
      setApprovedFunds(await res2.json());
    } catch (err) {
      alert('펀딩 목록 조회 실패');
    }
  };

  const fetchCommunityPosts = async () => {
    try {
      const res = await fetch('/api/community/view', { credentials: 'include' });
      if (!res.ok) throw new Error();
      setCommunityPosts(await res.json());
    } catch (err) {
      alert('제안게시판 목록 조회 실패');
    }
  };

  const handleSelectFund = async (fund) => {
    setSelectedFund(null);
    const endpoint = fundMode === 'unapproved'
      ? `/api/fund/admin/unapproved/${fund.id}`
      : `/api/fund/view/${fund.id}`;

    try {
      const res = await fetch(endpoint);
      if (!res.ok) throw new Error();
      setSelectedFund(await res.json());
    } catch (err) {
      alert('상세 정보 조회 실패');
    }
  };

  const handleApprove = async (fundId) => {
    try {
      const res = await fetch(`/api/fund/admin/approve/${fundId}`, { method: 'PUT' });
      if (!res.ok) throw new Error();
      alert('승인 완료!');
      await fetchFunds();
      setSelectedFund(null);
    } catch (err) {
      alert('승인 실패');
    }
  };

  const handleCommunityStatusChange = async (id, newStatus) => {
    try {
      const res = await fetch(`/api/community/admin/edit/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) throw new Error();
      alert('상태 변경 완료!');
      fetchCommunityPosts();
    } catch (err) {
      alert('상태 변경 실패');
    }
  };

  const fundsToShow = fundMode === 'unapproved' ? unapprovedFunds : approvedFunds;

  return (
    <div className="fund-admin">
      <h2>🔧 관리자 페이지</h2>

      <div className="admin-tabs">
        <button
          className={activeTab === 'fund' ? 'active' : ''}
          onClick={() => setActiveTab('fund')}
        >
          💰 펀딩 관리
        </button>
        <button
          className={activeTab === 'community' ? 'active' : ''}
          onClick={() => setActiveTab('community')}
        >
          🗂 제안 게시판 관리
        </button>
      </div>

      {activeTab === 'fund' && (
        <>
          <div className="tab-buttons">
            <button
              className={fundMode === 'unapproved' ? 'active' : ''}
              onClick={() => {
                setFundMode('unapproved');
                setSelectedFund(null);
              }}
            >
              📝 미승인 펀딩
            </button>
            <button
              className={fundMode === 'approved' ? 'active' : ''}
              onClick={() => {
                setFundMode('approved');
                setSelectedFund(null);
              }}
            >
              ✅ 승인된 펀딩
            </button>
          </div>

          <div className="fund-list">
            <h3>{fundMode === 'unapproved' ? '📋 미승인 목록' : '📦 승인된 목록'}</h3>
            <ul>
              {fundsToShow.map((f) => (
                <li key={f.id} onClick={() => handleSelectFund(f)}>
                  <img src={f.fundImages?.[0] || f.imageUrl} alt="썸네일" width="80" height="60" />
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
              {fundMode === 'unapproved' && (
                <button onClick={() => handleApprove(selectedFund.id)}>✅ 승인하기</button>
              )}
            </div>
          )}
        </>
      )}

      {activeTab === 'community' && (
        <div className="community-admin">
          <h2>🗂 제안게시판 상태 변경</h2>
          <ul>
            {communityPosts.map((post) => (
              <li key={post.id} className="community-item">
                <span>
                  <strong>{post.title}</strong>
                  {" "} - 상태: {post.status}
                  {" "} - 💗 공감 수: {post.likes}
                </span>
                <select
                  value={post.status}
                  onChange={(e) => handleCommunityStatusChange(post.id, e.target.value)}
                >
                  <option value="RECRUITING">공감하기</option>
                  <option value="FUNDED">펀딩 완료</option>
                  <option value="ON_HOLD">보류 중</option>
                </select>
              </li>

            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default AdminPage;
