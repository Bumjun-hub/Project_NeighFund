import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import './FundInfoPage.css';
import './Modal.css';
import Section from '../../components/Section';
import FundParticipatePage from '../fundparticipantpage/FundParticipatePage.js'; //  참여 컴포넌트 import

const FundInfoPage = () => {
    const { id } = useParams();
    const [fund, setFund] = useState(null);
    const [activeTab, setActiveTab] = useState('intro');
    const [selectedReward, setSelectedReward] = useState(null);
    const [myOrderOptionIds, setMyOrderOptionIds] = useState([]);
    const [showModal, setShowModal] = useState(false); //  모달 제어용
    const isClosed = fund && new Date(fund.deadline) < new Date();
    const [isAdmin, setIsAdmin] = useState(false); // ✅ 관리자 여부 확인용
    const navigate = useNavigate();

    const categoryMap = {
        EDUCATION: "교육",
        ENVIRONMENT: "환경",
        CULTURE: "문화",
        PET: "애완동물",
        SPORTS: "운동",
        FOOD: "음식",
        HOBBY: "취미",
        WELFARE: "복지",
        ETC: "기타"
    };




    //  리워드 선택
    const handleSelectReward = (opt) => {
        if (myOrderOptionIds.includes(opt.id)) {
            alert("이미 신청한 리워드입니다.");
            return;
        }
        setSelectedReward((prev) => (prev?.id === opt.id ? null : opt));
    };

    // 참여 버튼 클릭 → 로그인 체크 후 모달 열기
    const handleParticipateClick = async () => {
        if (!selectedReward) {
            alert("리워드를 선택해주세요!");
            return;
        }

        try {
            const res = await fetch("/api/auth/roleinfo", {
                method: "GET",
                credentials: "include",
            });

            if (!res.ok) {
                alert("로그인이 필요한 기능입니다.");
                window.location.href = "/login";
                return;
            }

            setShowModal(true); //  창 대신 모달 열기
        } catch (error) {
            alert("서버 오류가 발생했습니다.");
            console.error("참여 버튼 오류:", error);
        }
    };


    // ✅ 관리자 여부 확인
    useEffect(() => {
        fetch("/api/auth/roleinfo", { credentials: "include" })
            .then(res => res.json())
            .then(data => {
                if (data.roleName === "ROLE_ADMIN") setIsAdmin(true);
            })
            .catch(err => console.error("권한 확인 실패", err));
    }, []);

    // ✅ 삭제 처리 함수
    const handleDelete = async () => {
        if (!window.confirm("정말 삭제하시겠습니까?")) return;

        try {
            const token = localStorage.getItem("accessToken");
            const res = await fetch(`/api/fund/delete/${id}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (!res.ok) throw new Error("삭제 실패");

            alert("삭제가 완료되었습니다.");
            navigate("/funding"); // 목록 페이지로 이동
        } catch (err) {
            alert("삭제 중 오류가 발생했습니다.");
            console.error("❌ 삭제 오류:", err);
        }
    };


    //  주문한 리워드 불러오기
    useEffect(() => {
        fetch("/api/orders/myPage/order", {
            method: "GET",
            credentials: "include",
        })
            .then((res) => res.ok ? res.json() : [])
            .then((data) => {
                const optionIds = data.map(order => order.optionId);
                setMyOrderOptionIds(optionIds);
            })
            .catch(() => setMyOrderOptionIds([]));
    }, []);

    //  펀딩 정보 불러오기
    useEffect(() => {
        fetch(`/api/fund/view/${id}`)
            .then((res) => res.json())
            .then((data) => setFund(data))
            .catch((err) => console.error("❌ 상세 불러오기 실패:", err));
    }, [id]);

    if (!fund) return <div className="not-found">해당 펀딩을 찾을 수 없습니다.</div>;

    return (
        <Section>
            <div className="fund-info-wrapper">
                <h2 className="fund-title">{fund.title}
                    {isAdmin && (
                        <button className="delete-btn" onClick={handleDelete}>
                            🗑️ 삭제
                        </button>
                    )}
                </h2>
                {/* 상단 */}
                <div className="fund-info-top">
                    <img src={fund.fundImages?.[0]} alt={fund.title} className="fund-info-image" />
                    <div className="fund-info-details">
                        <span className="fund-tag">#{categoryMap[fund.category] || fund.category}</span>


                        <h3 className="fund-name">{fund.title}</h3>
                        <p className="fund-subtext">{fund.subTitle}</p>

                        <div className="fund-stats-box">
                            <div className="fund-stat"><span>목표 금액</span><strong>{fund.targetAmount?.toLocaleString()}원</strong></div>
                            <div className="fund-stat"><span>현재 금액</span><strong>{fund.currentAmount?.toLocaleString()}원</strong></div>
                            <div className="fund-stat"><span>참여자 수</span><strong>{fund.currentParticipants}명</strong></div>
                            <div className="fund-stat"><span>마감일</span><strong>{fund.deadline?.split("T")[0]}</strong></div>
                        </div>
                    </div>
                </div>

                {/* 탭 */}
                <div className="fund-tabs">
                    <button className={activeTab === 'intro' ? 'active' : ''} onClick={() => setActiveTab('intro')}>소개</button>
                    <button className={activeTab === 'budget' ? 'active' : ''} onClick={() => setActiveTab('budget')}>예산</button>
                    <button className={activeTab === 'schedule' ? 'active' : ''} onClick={() => setActiveTab('schedule')}>일정</button>
                </div>

                {/* 본문 + 리워드 */}
                <div className="fund-info-layout">
                    <div className="fund-info-content">
                        <div className="fund-main-left">
                            {activeTab === 'intro' && (
                                <div className="fund-description-box">
                                    {fund.content?.split('\n').map((line, idx) => <p key={idx}>{line}</p>)}
                                    {fund.contentImgUrls?.map((url, idx) => (
                                        <img key={idx} src={url} alt={`본문 이미지 ${idx + 1}`} className="fund-content-image" />
                                    ))}
                                </div>
                            )}
                            {activeTab === 'budget' && (
                                <div className="fund-description-box">
                                    <p>이 펀딩의 목표 금액은 <strong>{fund.targetAmount.toLocaleString()}원</strong>이며, 펀딩 금액은 제작비, 홍보비, 기부금 등으로 사용됩니다.</p>
                                </div>
                            )}
                            {activeTab === 'schedule' && (
                                <div className="fund-description-box">
                                    <p>📌 등록일: {fund.createdAt?.split("T")[0]}</p>
                                    <p>📌 마감일: {fund.deadline?.split("T")[0]}</p>
                                    <p>📦 리워드 발송 예정일: 추후 공지</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* 리워드 */}
                    <div className="fund-reward-right">
                        <h3 style={{ marginBottom: '10px' }}>🎁 리워드</h3>
                        {fund.options?.map((opt, idx) => (
                            <div className="fund-reward-item" key={idx}>
                                <label>
                                    <input
                                        type="checkbox"
                                        disabled={isClosed || myOrderOptionIds.includes(opt.id)}
                                        checked={selectedReward?.id === opt.id}
                                        onChange={() => handleSelectReward(opt)}
                                    />
                                    {isClosed && <p className="reward-closed-msg">⚠️ 마감된 펀딩입니다.</p>}
                                    <span className="reward-title">{opt.title} - {opt.amount?.toLocaleString()}원</span>
                                </label>
                                <p className="reward-desc">{opt.description}</p>
                                <span className={`reward-quantity ${opt.quantity === 0 ? 'out-of-stock' : ''}`}>
                                    재고 {opt.quantity}개 남음!
                                </span>
                            </div>
                        ))}
                        <button
                            className="fund-participate-btn"
                            disabled={!selectedReward}
                            onClick={handleParticipateClick}
                        >
                            {isClosed ? "마감된 펀딩입니다" : "선택한 리워드로 펀딩 신청하기"}
                        </button>
                    </div>
                </div>
            </div>

            {/*  참여 모달 */}
            {showModal && (
                <div className="modal-backdrop" onClick={() => setShowModal(false)}>
                    <div className="modal_content" onClick={e => e.stopPropagation()}>
                        <button className="modal-close" onClick={() => setShowModal(false)}>X</button>
                        <FundParticipatePage
                            fundId={fund.id}
                            optionId={selectedReward.id}
                            rewardTitle={selectedReward.title}
                            rewardAmount={selectedReward.amount}
                        />
                    </div>
                </div>
            )}
        </Section>
    );
};

export default FundInfoPage;
