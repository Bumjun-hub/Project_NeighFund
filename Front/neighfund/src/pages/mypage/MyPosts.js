// MyPosts.js
import React, { useState, useEffect } from 'react';
import { authenticatedFetch } from '../../utils/authUtils';
import SuggestionCard from '../../components/SuggestionCard';
import GatheringCard from '../../components/GatheringCard';
import FundCard from '../../components/FundCard';
import './MyPosts.css';
import { useNavigate } from 'react-router-dom';

const TAB = {
    WRITTEN: 'written',
    LIKED: 'liked',
    FUND: 'fund',
    GATHERING: 'gathering',
    CLASS: 'class'
};


const MyPosts = () => {
    const navigate = useNavigate();
    // 유저 정보 추가  // 변경됨
    const [userInfo, setUserInfo] = useState(null);

    const [myCommunityPosts, setMyCommunityPosts] = useState([]);
    const [likedPosts, setLikedPosts] = useState([]);
    const [participatedFunds, setParticipatedFunds] = useState([]);
    const [participatedGatherings, setParticipatedGatherings] = useState([]);
    const [myReservations, setMyReservations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState(TAB.WRITTEN);

    useEffect(() => {
        fetchAllMyPosts();
        fetchUserInfo(); // 변경됨
    }, []);

    // 유저 프로필 정보 불러오기  // 변경됨
    const fetchUserInfo = async () => {
        try {
            const res = await authenticatedFetch('/api/auth/mypage', { credentials: 'include' });
            if (res.ok) {
                const data = await res.json();
                setUserInfo(data);
            }
        } catch (e) {
            setUserInfo(null);
        }
    };

    const fetchAllMyPosts = async () => {
        setLoading(true);
        try {
            const myCommunity = await authenticatedFetch('/api/community/myPosts', { credentials: 'include' });
            setMyCommunityPosts(myCommunity.ok ? await myCommunity.json() : []);
            const myLiked = await authenticatedFetch('/api/community/myLiked', { credentials: 'include' });
            setLikedPosts(myLiked.ok ? await myLiked.json() : []);
            const myOrders = await authenticatedFetch('/api/orders/myPage/order', { credentials: 'include' });
            setParticipatedFunds(myOrders.ok ? await myOrders.json() : []);
            const gatheringsRes = await authenticatedFetch('/api/gatherings/free/myParticipation', { credentials: 'include' });
            setParticipatedGatherings(gatheringsRes.ok ? await gatheringsRes.json() : []);
            const myReservationsRes = await authenticatedFetch('/api/gatherings/vendor/myPage/reservation', { credentials: 'include' });
            setMyReservations(myReservationsRes.ok ? await myReservationsRes.json() : []);
        
        
        } catch (e) {
            setMyCommunityPosts([]); setLikedPosts([]); setParticipatedFunds([]); setMyReservations([]);
        } finally {
            setLoading(false);
        }
    };

    // 프로필 사진 url 생성  // 변경됨
    const getProfileImageUrl = (imageUrl) => {
        if (!imageUrl) return null;
        return `http://localhost:8080${imageUrl}?t=${Date.now()}`;
    };

    if (loading) return <div className="myposts-container">로딩 중...</div>;

    return (
        <div className="mypage-root"> {/* 변경됨: 전체 레이아웃 */}
            {/* 왼쪽: 프로필/사이드바 */}
            <div className="mypage-sidebar">
                <div className="user-profile-box">
                    {userInfo?.imageUrl ? (
                        <img src={getProfileImageUrl(userInfo.imageUrl)} alt="프로필" className="profile-img" />
                    ) : (
                        <div className="profile-placeholder">{(userInfo?.username || "U").charAt(0)}</div>
                    )}
                    <div className="profile-name">{userInfo?.username || "로그인 필요"}</div>
                    {/* 추가로 이메일/연락처 등 표시 가능 */}
                </div>
                <div className="sidebar-menu">
                    <button className={activeTab === TAB.WRITTEN ? 'active' : ''} onClick={() => setActiveTab(TAB.WRITTEN)}>
                        내가 쓴 제안글
                    </button>
                    <button className={activeTab === TAB.LIKED ? 'active' : ''} onClick={() => setActiveTab(TAB.LIKED)}>
                        공감/좋아요 누른 제안글
                    </button>
                    <button className={activeTab === TAB.FUND ? 'active' : ''} onClick={() => setActiveTab(TAB.FUND)}>
                        참여 중인 펀딩
                    </button>
                    <button className={activeTab === TAB.GATHERING ? 'active' : ''} onClick={() => setActiveTab(TAB.GATHERING)}>
                        참여 중인 소모임
                    </button>
                    <button className={activeTab === TAB.CLASS ? 'active' : ''} onClick={() => setActiveTab(TAB.CLASS)}>
                        예약한 원데이클래스
                    </button>
                </div>
            </div>

            {/* 오른쪽: 내용 */}
            <div className="mypage-main-content">
                {activeTab === TAB.WRITTEN && (
                    <div>
                        <h3>내가 쓴 제안글</h3>
                        <div className="card-list-flex">
                            {myCommunityPosts.length === 0
                                ? <div>작성한 글이 없습니다.</div>
                                : myCommunityPosts.map(post => <SuggestionCard key={post.id} post={post} size="small" />)}
                        </div>
                    </div>
                )}
                {activeTab === TAB.LIKED && (
                    <div>
                        <h3>공감/좋아요 누른 제안글</h3>
                        <div className="card-list-flex">
                            {likedPosts.length === 0
                                ? <div>좋아요 누른 글이 없습니다.</div>
                                : likedPosts.map(post => <SuggestionCard key={post.id} post={post} size="small"/>)}
                        </div>
                    </div>
                )}
                {activeTab === TAB.FUND && (
                    <div>
                        <h3>참여 중인 펀딩</h3>
                        <div className="mini-card-list">
                            {participatedFunds.length === 0
                                ? <div>참여 중인 펀딩이 없습니다.</div>
                                : participatedFunds.map(order => (
                                    <div
                                        className="mini-card"
                                        key={order.id}
                                        style={{ cursor: 'pointer' }}
                                        onClick={() => navigate(`/funding/info/${order.fundId}`)}
                                    // 또는 navigate(`/funding/info/${order.fundId}`)을 써도 됨 (useNavigate 사용 시)
                                    >
                                        {/* 대표 이미지 */}
                                        {order.fundImage && (
                                            <img src={order.fundImage} alt="펀딩 이미지" />
                                        )}
                                        {/* 펀딩 제목 */}
                                        <div className="card-title">{order.fundTitle}</div>
                                        {/* 리워드명/수량 */}
                                        <div className="card-option">{order.optionTitle}</div>
                                        <div className="card-qty">{order.quantity}개</div>
                                        {/* Progress Bar */}
                                        {order.progressRate !== undefined && (
                                            <div className="mini-progress-bar-wrapper">
                                                <div
                                                    className="mini-progress-bar-fill"
                                                    style={{ width: `${order.progressRate}%` }}
                                                />
                                            </div>
                                        )}
                                        {/* % 표시 및 마감일 등 */}
                                        <div className="card-meta">
                                            <span>{order.progressRate ?? 0}% 달성</span>
                                            {order.deadline && (
                                                <span style={{ marginLeft: 8 }}>
                                                    / 마감: {new Date(order.deadline).toLocaleDateString()}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                ))
                            }
                        </div>
                    </div>
                )}
                {activeTab === TAB.GATHERING && (
                    <div>
                        <h3>참여 중인 소모임</h3>
                        <div className="card-list-flex">
                            {participatedGatherings.length === 0
                                ? <div>참여 중인 소모임이 없습니다.</div>
                                : participatedGatherings.map(g => <GatheringCard key={g.id} gathering={g} large />)}
                        </div>
                    </div>
                )}
                {activeTab === TAB.CLASS && (
    <div>
        <h3>예약한 원데이클래스</h3>
        <div className="mini-card-list">
            {myReservations.length === 0
                ? <div>예약 내역이 없습니다.</div>
                : myReservations.map((res, index) => (
                    <div
                        className="reservation-card"
                        key={index}
                    >
                        {/* 클래스 제목 */}
                        <div className="reservation-title">
                            {res.classTitle || "클래스명 없음"}
                        </div>
                        
                        {/* 예약 날짜와 시간 */}
                        <div className="reservation-datetime">
                            <div className="reservation-date">
                                📅 {res.date}
                            </div>
                            <div className="reservation-time">
                                🕐 {res.startTime} - {res.endTime}
                            </div>
                        </div>
                        
                        {/* 인원수와 상태 */}
                        <div className="reservation-info">
                            <div className="reservation-participants">
                                👥 {res.participantCount}명
                            </div>
                            <div className={`reservation-status status-${res.status?.toLowerCase()}`}>
                                {res.status === 'PAID' ? '✅ 결제완료' : 
                                 res.status === 'PENDING' ? '⏳ 입금대기' :
                                 res.status === 'CANCELLED' ? '❌ 취소됨' : 
                                 res.status}
                            </div>
                        </div>
                        
                        {/* 입금 정보 (PENDING 상태일 때만) */}
                        {res.status === 'PENDING' && res.paymentBank && (
                            <div className="payment-info">
                                <div className="payment-bank">
                                    🏦 {res.paymentBank}
                                </div>
                                <div className="payment-name">
                                    💳 {res.paymentName}
                                </div>
                            </div>
                        )}
                    </div>
                ))
            }
        </div>
    </div>
)}
            </div>
        </div>
    );
};

export default MyPosts;
