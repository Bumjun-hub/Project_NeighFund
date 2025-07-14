import React, { useState, useEffect } from 'react';
import { authenticatedFetch } from '../../utils/authUtils';
import './MyPosts.css';
import SuggestionCard from '../../components/SuggestionCard';
import GatheringCard from '../../components/GatheringCard';
import FundCard from '../../components/FundCard';

const TAB = {
    WRITTEN: 'written',
    LIKED: 'liked',
    FUND: 'fund',
    GATHERING: 'gathering',
    CLASS: 'class'
};

const MyPosts = () => {
    // 기존 커뮤니티 내가 쓴 글
    const [myCommunityPosts, setMyCommunityPosts] = useState([]);
    // 내가 공감/좋아요한 제안게시판 글
    const [likedPosts, setLikedPosts] = useState([]);
    // 참여 중인 펀딩
    const [participatedFunds, setParticipatedFunds] = useState([]);
    // 참여 중인 소모임
    const [participatedGatherings, setParticipatedGatherings] = useState([]);
    // 참여 중인 원데이클래스
    const [myReservations, setMyReservations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState(TAB.WRITTEN);

    useEffect(() => {
        fetchAllMyPosts();
    }, []);

    const fetchAllMyPosts = async () => {
        setLoading(true);
        try {
            // 1. 내가 쓴 제안글(제안게시판, 커뮤니티)
            const myCommunity = await authenticatedFetch('/api/community/myPosts', { credentials: 'include' });

            if (!myCommunity.ok) {
                const errText = await myCommunity.text();
                console.error('/api/community/myPosts error:', myCommunity.status, errText);
                setMyCommunityPosts([]);
            } else {
                const data = await myCommunity.json();
                setMyCommunityPosts(data);
            }

            // 2. 내가 좋아요(공감) 누른 제안글
            const myLiked = await authenticatedFetch('/api/community/myLiked', { credentials: 'include' });

            if (!myLiked.ok) {
                const errText = await myLiked.text();
                console.error('/api/community/myLiked error:', myLiked.status, errText);
                setLikedPosts([]);
            } else {
                const data = await myLiked.json();
                setLikedPosts(data);
            }

            // 3. 참여 중인 펀딩 (주문 내역에서 추출)
            const myOrders = await authenticatedFetch('/api/orders/myPage/order', { credentials: 'include' });
            if (!myOrders.ok) {
                setParticipatedFunds([]);
            } else {
                const orderData = await myOrders.json();
                setParticipatedFunds(orderData); // orderData는 OrderResponseDto[]
            }

            const gatheringsRes = await authenticatedFetch('/api/gatherings/free/myParticipation', { credentials: 'include' });
            if (!gatheringsRes.ok) {
                const errText = await gatheringsRes.text();
                console.error('/api/gatherings/free/myParticipation error:', gatheringsRes.status, errText);
                setParticipatedGatherings([]);
            } else {
                const gatheringData = await gatheringsRes.json();
                setParticipatedGatherings(gatheringData);
            }

            // (추후: 참여 중인 소모임, 원데이클래스도 여기에서 비슷하게 추가 가능)

        } catch (e) {
            // 네트워크/알 수 없는 에러
            console.error('fetchAllMyPosts error:', e);
            setMyCommunityPosts([]);
            setLikedPosts([]);
            setParticipatedFunds([]);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="myposts-container">로딩 중...</div>;

    return (
        <div className="myposts-container">
            {/* 탭 버튼 */}
            <div className="tab-container">
                <button className={`tab-btn ${activeTab === TAB.WRITTEN ? 'active' : ''}`}
                    onClick={() => setActiveTab(TAB.WRITTEN)}>내가 쓴 제안글</button>
                <button className={`tab-btn ${activeTab === TAB.LIKED ? 'active' : ''}`}
                    onClick={() => setActiveTab(TAB.LIKED)}>공감/좋아요 누른 제안글</button>
                <button className={`tab-btn ${activeTab === TAB.FUND ? 'active' : ''}`}
                    onClick={() => setActiveTab(TAB.FUND)}>참여 중인 펀딩</button>
                <button className={`tab-btn ${activeTab === TAB.GATHERING ? 'active' : ''}`}
                    onClick={() => setActiveTab(TAB.GATHERING)}>참여 중인 소모임</button>
                <button className={`tab-btn ${activeTab === TAB.CLASS ? 'active' : ''}`}
                    onClick={() => setActiveTab(TAB.CLASS)}>예약한 원데이클래스</button>
            </div>
            {/* 탭별 내용 */}
            {activeTab === TAB.WRITTEN && (
                <div>
                    <h3>내가 쓴 제안글</h3>
                    <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
                        {myCommunityPosts.length === 0
                            ? <div>작성한 글이 없습니다.</div>
                            : myCommunityPosts.map(post => <SuggestionCard key={post.id} post={post} />)}
                    </div>
                </div>
            )}
            {activeTab === TAB.LIKED && (
                <div>
                    <h3>공감/좋아요 누른 제안글</h3>
                    <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
                        {likedPosts.length === 0
                            ? <div>좋아요 누른 글이 없습니다.</div>
                            : likedPosts.map(post => <SuggestionCard key={post.id} post={post} />)}
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
                                <div className="mini-card" key={order.id}>
                                    <div className="card-title">{order.fundTitle}</div>
                                    <div className="card-option">{order.optionTitle}</div>
                                    <div className="card-qty">{order.quantity}개</div>
                                </div>
                            ))}
                    </div>
                </div>
            )}

            {activeTab === TAB.GATHERING && (
                <div>
                    <h3>참여 중인 소모임</h3>
                    <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
                        {participatedGatherings.length === 0
                            ? <div>참여 중인 소모임이 없습니다.</div>
                            : participatedGatherings.map(g => <GatheringCard key={g.id} gathering={g} />)}
                    </div>
                </div>
            )}
        </div>
    );
};

export default MyPosts;
