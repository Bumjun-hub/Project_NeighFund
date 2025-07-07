import React, { useState, useEffect } from 'react';
import './AdminPage.css';

const AdminPage = () => {
  const [unapprovedFunds, setUnapprovedFunds] = useState([]);
  const [approvedFunds, setApprovedFunds] = useState([]);
  const [selectedFund, setSelectedFund] = useState(null);
  const [communityPosts, setCommunityPosts] = useState([]);
  const [activeTab, setActiveTab] = useState('fund'); // 'fund' | 'community'
  const [fundMode, setFundMode] = useState('unapproved'); // 'unapproved' | 'approved'
  const [surveys, setSurveys] = useState([]);
  const [orders, setOrders] = useState([]);

  // 관리자 페이지에서 제목 검색
  const [funds, setFunds] = useState([]);
  const [selectedFundId, setSelectedFundId] = useState("");


  useEffect(() => {
    fetchFunds();
    fetchCommunityPosts();
    fetchSurveys();
  }, []);


  useEffect(() => {
    fetch("/api/auth/roleinfo", { credentials: "include" })
      .then(res => res.json())
      .then(data => {
        console.log("🔍 roleinfo 응답 확인:", data);
        if (data.roleName !== "ROLE_ADMIN") {
          alert("관리자만 접근 가능합니다.");
          window.location.href = "/";
        }
      })
      .catch(err => {
        alert("로그인이 필요합니다.");
        window.location.href = "/login";
      });
  }, []);

  useEffect(() => {
    fetch("/api/fund/titles")
      .then(res => res.json())
      .then(data => setFunds(data));
  }, []);

  // 드롭다운 바뀔때 주문 목록 다시 불러오기 
  useEffect(() => {
    if (activeTab === 'orders' && selectedFundId) {
      fetchOrdersByFund(selectedFundId);
    }
  }, [selectedFundId, activeTab]);




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





  //설문 데이터 불러오기
  const fetchSurveys = async () => {
    try {
      const res = await fetch("/api/survey/admin/view", { credentials: "include" });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setSurveys(data);
    } catch (err) {
      alert("설문 목록 조회 실패");
    }
  };

  // 설문조사 상태 관리 
  const handleSurveyVisibleChange = async (id, newVisible) => {
    try {
      const res = await fetch(`/api/survey/admin/status/${id}?visible=${newVisible}`, {
        method: 'PUT',
        credentials: 'include',
      });
      if (!res.ok) throw new Error();
      alert('설문 상태 변경 완료!');
      fetchSurveys();
    } catch (err) {
      alert('설문 상태 변경 실패');
    }
  };

  //주문자 데이터
  const fetchOrders = async () => {
    try {
      const res = await fetch('/api/orders/admin/order', { credentials: 'include' }); // ✅ 경로 수정
      if (!res.ok) throw new Error();
      const data = await res.json();
      setOrders(data);
    } catch (err) {
      alert('주문 목록 조회 실패');
    }
  };

  // 주문자 상태 변경
  const handleOrderStatusChange = async (orderId, newStatus) => {
    try {
      const res = await fetch(`/api/orders/admin/${orderId}/status?status=${newStatus}`, {
        method: 'PUT',
        credentials: 'include',
      });
      if (!res.ok) throw new Error();
      alert('주문 상태 변경 완료!');
      fetchOrders(); // ✅ 변경 후 새로고침
    } catch (err) {
      alert('주문 상태 변경 실패');
    }
  };

  // 펀드 제목으로 필터링
  const fetchOrdersByFund = async (fundId) => {
    try {
      const res = await fetch(`/api/orders/admin/byFund/${fundId}`, { credentials: 'include' });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setOrders(data);
    } catch (err) {
      alert('선택한 펀딩의 주문 목록 조회 실패');
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

        <button className={activeTab === 'survey' ? 'active' : ''}
          onClick={() => setActiveTab('survey')}
        >설문관리</button>

        <button
          className={activeTab === 'orders' ? 'active' : ''}
          onClick={() => {
            setActiveTab('orders');
            fetchOrders(); // 🔄 탭 클릭 시 주문 목록 불러오기
          }}
        >
          📦 주문 관리
        </button>
        <select
          value={selectedFundId}
          onChange={(e) => setSelectedFundId(e.target.value)}
        >
          <option value="">펀딩 선택</option>
          {funds.map(fund => (
            <option key={fund.id} value={fund.id}>
              {fund.title}
            </option>
          ))}
        </select>

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

      {activeTab === 'survey' && (
        <div className="survey-admin">
          <h2>📊 설문 관리</h2>
          <ul>
            {surveys.map((survey) => {
              const total = survey.totalVotes || 0;

              return (
                <li key={survey.surveyId} className="survey-item">
                  <div style={{ marginBottom: '5px' }}>
                    <strong>📌 질문: </strong> {survey.title}
                    <br />
                    <strong>상태: </strong> {survey.visible ? '공개' : '비공개'} | 총 투표수: {total}
                    <br />
                    <label>설문 공개 상태 변경: </label>
                    <select
                      value={survey.visible ? 'true' : 'false'}
                      onChange={(e) => handleSurveyVisibleChange(survey.surveyId, e.target.value)}
                    >d
                      <option value="true">공개</option>
                      <option value="false">비공개</option>
                    </select>
                  </div>

                  {/* 선택지 표시 */}
                  <ul style={{ marginTop: '10px', marginBottom: '20px' }}>
                    {survey.options && survey.options.map((opt) => {
                      const percentage = total === 0 ? 0 : ((opt.voteCount / total) * 100).toFixed(1);
                      return (
                        <li key={opt.optionId}>
                          🟢 {opt.content} - {opt.voteCount}표 ({percentage}%)
                        </li>
                      );
                    })}
                  </ul>

                  <hr />
                </li>
              );
            })}
          </ul>
        </div>
      )}


      {activeTab === 'orders' && (
        <div className="order-admin">
          <h2>📦 주문 관리</h2>
          <table className="order-table">
            <thead>
              <tr>
                <th>펀딩명</th>
                <th>리워드명</th>
                <th>수량</th>
                <th>총금액</th>
                <th>입금자명</th>
                <th>은행</th>
                <th>전화번호</th>
                <th>상태</th>
                <th>변경</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(order => (
                <tr key={order.id}>
                  <td>{order.fundTitle}</td>
                  <td>{order.optionTitle}</td>
                  <td>{order.quantity}</td>
                  <td>{order.totalAmount?.toLocaleString()}원</td>
                  <td>{order.paymentName}</td>
                  <td>{order.paymentBank}</td>
                  <td>{order.phone}</td>
                  <td>{order.status}</td>
                  <td>
                    <select
                      value={order.status}
                      onChange={(e) => handleOrderStatusChange(order.id, e.target.value)}
                    >
                      <option value="PENDING">결제 대기</option>
                      <option value="PAID">입금 완료</option>
                      <option value="COMPLETED">배송 완료</option>
                      <option value="CANCELLED">취소</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}


    </div>
  );
};

export default AdminPage;
