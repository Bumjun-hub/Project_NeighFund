import React, { useEffect, useState } from 'react';
import './AdminPage.css';
import FundAdminTab from './FundAdminTab';
import CommunityAdminTab from './CommunityAdminTab';
import SurveyAdminTab from './SurveyAdminTab';
import OrderAdminTab from './OrderAdminTab';
import GatheringAdminTab from './GatheringAdminTab';

const AdminPage = () => {
  const [activeTab, setActiveTab] = useState('fund'); // 현재 탭
  const [unapprovedFunds, setUnapprovedFunds] = useState([]);
  const [approvedFunds, setApprovedFunds] = useState([]);
  const [selectedFund, setSelectedFund] = useState(null);
  const [fundMode, setFundMode] = useState('unapproved'); // 승인 or 미승인

  const [communityPosts, setCommunityPosts] = useState([]);
  const [surveys, setSurveys] = useState([]);
  const [orders, setOrders] = useState([]);

  const [funds, setFunds] = useState([]); // 전체 펀딩 목록
  const [selectedFundId, setSelectedFundId] = useState("");

  const [gatherings, setGatherings] = useState([]);

  // 관리자 인증
  useEffect(() => {
    fetch("/api/auth/roleinfo", { credentials: "include" })
      .then(res => res.json())
      .then(data => {
        if (data.roleName !== "ROLE_ADMIN") {
          alert("관리자만 접근 가능합니다.");
          window.location.href = "/";
        }
      })
      .catch(() => {
        alert("로그인이 필요합니다.");
        window.location.href = "/login";
      });
  }, []);

  useEffect(() => {
    fetchFunds();
    fetchCommunityPosts();
    fetchSurveys();
    fetchFundTitles();
    fetchGatherings();
  }, []);

  // 펀딩명 바뀌면 주문 목록 새로고침
  useEffect(() => {
    if (activeTab === 'orders' && selectedFundId) {
      fetchOrdersByFund(selectedFundId);
    }
  }, [selectedFundId, activeTab]);

  const fetchFunds = async () => {
    const [res1, res2] = await Promise.all([
      fetch('/api/fund/admin/unapproved'),
      fetch('/api/fund/view')
    ]);
    setUnapprovedFunds(await res1.json());
    setApprovedFunds(await res2.json());
  };

  const fetchCommunityPosts = async () => {
    const res = await fetch('/api/community/view', { credentials: 'include' });
    setCommunityPosts(await res.json());
  };

  const fetchSurveys = async () => {
    const res = await fetch("/api/survey/admin/view", { credentials: "include" });
    setSurveys(await res.json());
  };

  const fetchFundTitles = async () => {
    const res = await fetch("/api/fund/titles");
    setFunds(await res.json());
  };

  const fetchOrders = async () => {
    const res = await fetch('/api/orders/admin/order', { credentials: 'include' });
    setOrders(await res.json());
  };

  const fetchOrdersByFund = async (fundId) => {
    const res = await fetch(`/api/orders/admin/byFund/${fundId}`, { credentials: 'include' });
    setOrders(await res.json());
  };

  const handleSelectFund = async (fund) => {
    setSelectedFund(null);
    const endpoint = fundMode === 'unapproved'
      ? `/api/fund/admin/unapproved/${fund.id}`
      : `/api/fund/view/${fund.id}`;

    const res = await fetch(endpoint);
    setSelectedFund(await res.json());
  };

  const handleApprove = async (fundId) => {
    await fetch(`/api/fund/admin/approve/${fundId}`, { method: 'PUT' });
    alert('승인 완료!');
    await fetchFunds();
    setSelectedFund(null);
  };

  const handleCommunityStatusChange = async (id, newStatus) => {
    await fetch(`/api/community/admin/edit/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus }),
    });
    fetchCommunityPosts();
  };

  const handleSurveyVisibleChange = async (id, newVisible) => {
    await fetch(`/api/survey/admin/status/${id}?visible=${newVisible}`, {
      method: 'PUT',
      credentials: 'include',
    });
    fetchSurveys();
  };

  const handleOrderStatusChange = async (orderId, newStatus) => {
    await fetch(`/api/orders/admin/${orderId}/status?status=${newStatus}`, {
      method: 'PUT',
      credentials: 'include',
    });
    fetchOrders();
  };

  const handleGatheringDelete = async (id) => {
    if (!window.confirm("정말 이 소모임을 삭제할까요?")) return;
    await fetch(`/api/gatherings/free/delete/${id}`, {
      method: 'DELETE',
      credentials: 'include'
    });
    alert('소모임이 삭제되었습니다!');
    // 삭제 후 소모임 목록 다시 불러오기
    fetchGatherings();
  };

  const fetchGatherings = async () => {
    const res = await fetch('/api/gatherings/free/list', { credentials: 'include' });
    const data = await res.json();
    setGatherings(Array.isArray(data) ? data : []);
  };



  return (
    <div className="fund-admin">
      <h2>🔧 관리자 페이지</h2>

      <div className="admin-tabs">
        <button className={activeTab === 'fund' ? 'active' : ''} onClick={() => setActiveTab('fund')}>💰 펀딩 관리</button>
        <button className={activeTab === 'community' ? 'active' : ''} onClick={() => setActiveTab('community')}>🗂 제안 게시판</button>
        <button className={activeTab === 'survey' ? 'active' : ''} onClick={() => setActiveTab('survey')}>📊 설문관리</button>
        <button className={activeTab === 'orders' ? 'active' : ''} onClick={() => { setActiveTab('orders'); fetchOrders(); }}>📦 주문 관리</button>
        <button className={activeTab === 'gathering' ? 'active' : ''} onClick={() => setActiveTab('gathering')}>👥 소모임 관리</button>
        {activeTab === 'orders' && (
          <select value={selectedFundId} onChange={(e) => setSelectedFundId(e.target.value)}>
            <option value="">펀딩 선택</option>
            {funds.map(fund => (
              <option key={fund.id} value={fund.id}>{fund.title}</option>
            ))}
          </select>
        )}
      </div>

      {/* 탭별 렌더링 */}
      {activeTab === 'fund' && (
        <FundAdminTab
          fundMode={fundMode}
          setFundMode={setFundMode}
          selectedFund={selectedFund}
          setSelectedFund={setSelectedFund}
          handleSelectFund={handleSelectFund}
          handleApprove={handleApprove}
          unapprovedFunds={unapprovedFunds} // ✅ 추가
          approvedFunds={approvedFunds}     // ✅ 추가
        />

      )}

      {activeTab === 'community' && (
        <CommunityAdminTab
          communityPosts={communityPosts}
          handleCommunityStatusChange={handleCommunityStatusChange}
        />
      )}

      {activeTab === 'survey' && (
        <SurveyAdminTab
          surveys={surveys}
          handleSurveyVisibleChange={handleSurveyVisibleChange}
        />
      )}

      {activeTab === 'orders' && (
        <OrderAdminTab
          orders={orders}
          selectedFundId={selectedFundId} // ✅ 추가
          handleOrderStatusChange={handleOrderStatusChange}
        />
      )}
      {activeTab === 'gathering' && (
        <GatheringAdminTab
          gatherings={gatherings}
          onDelete={handleGatheringDelete}
        />
      )}
    </div>
  );
};

export default AdminPage;
