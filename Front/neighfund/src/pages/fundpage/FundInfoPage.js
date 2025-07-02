import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import './FundInfoPage.css';
import Section from '../../components/Section';

const FundInfoPage = () => {
    const { id } = useParams();
    const [fund, setFund] = useState(null);
    const [activeTab, setActiveTab] = useState('intro');

    const [selectedReward, setSelectedReward] = useState(null);

    // 리워드 선택 핸들러
    const handleSelectReward = (opt) => {
        setSelectedReward((prev) =>
            prev?.title === opt.title ? null : opt
        ); // 같은 항목 누르면 해제
    };

    const handleParticipateClick = () => {
        if (!selectedReward) return alert("리워드를 선택해주세요!");

        const url = `/funding/participate?id=${id}&optionId=${selectedReward.id}&title=${encodeURIComponent(selectedReward.title)}&amount=${selectedReward.amount}`;
        window.open(url, '_blank', 'width=700,height=800');
    };

    useEffect(() => {
        fetch(`/api/fund/view/${id}`)
            .then((res) => res.json())
            .then((data) => {
                console.log("🔍 상세 데이터:", data);
                setFund(data);
            })
            .catch((err) => console.error("❌ 상세 불러오기 실패:", err));
    }, [id]);

    if (!fund) return <div className="not-found">해당 펀딩을 찾을 수 없습니다.</div>;


    return (
        <Section>
            <div className="fund-info-wrapper">
                <h2 className="fund-title">{fund.title}</h2>

                <div className="fund-info-top">
                    <img src={fund.fundImages?.[0]} alt={fund.title} className="fund-info-image" />
                    <div className="fund-info-details">
                        <span className="fund-tag">#{fund.category}</span>
                        <h3 className="fund-name">{fund.title}</h3>
                        <p className="fund-subtext">{fund.subTitle}</p>

                        <div className="fund-stats">

                            <p><strong>목표 금액:</strong> {fund.targetAmount.toLocaleString()}원</p>
                            <p><strong>현재 금액:</strong> {fund.currentAmount.toLocaleString()}원</p>
                            <p><strong>참여자 수:</strong> {fund.currentParticipants}명</p>
                            <p><strong>마감일:</strong> {fund.deadline?.split("T")[0]}</p>
                        </div>


                        <p className="fund-likes">♡ {fund.likes}</p>
                    </div>
                </div>

                {/* 탭 */}
                <div className="fund-tabs">
                    <button className={activeTab === 'intro' ? 'active' : ''} onClick={() => setActiveTab('intro')}>소개</button>
                    <button className={activeTab === 'budget' ? 'active' : ''} onClick={() => setActiveTab('budget')}>예산</button>
                    <button className={activeTab === 'schedule' ? 'active' : ''} onClick={() => setActiveTab('schedule')}>일정</button>
                </div>

                <div className='fund-info-layout'>
                    <div className='fund-info-content'>
                        <div className='fund-main-left'>
                            {activeTab === 'intro' && (
                                <div className="fund-description-box">
                                    {fund.content?.split('\n').map((line, idx) => (
                                        <p key={idx}>{line}</p>
                                    ))}

                                    {/* 본문 이미지 */}
                                    {fund.contentImgUrls && fund.contentImgUrls.length > 0 && (
                                        <div className="fund-content-images">
                                            {fund.contentImgUrls.map((url, idx) => (
                                                <img key={idx} src={url} alt={`본문 이미지 ${idx + 1}`} className="fund-content-image" />
                                            ))}
                                        </div>
                                    )}
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
                    {/* ✅ 리워드 목록 렌더링 */}
                    <div className='fund-reward-right'>
                        <h3 style={{ marginBottom: '10px' }}>🎁 리워드</h3>
                        {fund.options && fund.options.map((opt, idx) => (
                            <div className="fund-reward-item" key={idx}>
                                <label>
                                    <input
                                        type="checkbox"
                                        checked={selectedReward?.title === opt.title}
                                        onChange={() => handleSelectReward(opt)}
                                    />
                                    <span className="reward-title">
                                        {opt.title} - {opt.amount?.toLocaleString() || '금액없음'}원
                                    </span>
                                </label>
                                <p className="reward-desc">{opt.description}</p>
                            </div>
                        ))}

                        {/* ✅ 리워드 선택 후 버튼 하나만 표시 */}
                        <button
                            className="fund-participate-btn"
                            disabled={!selectedReward}
                            onClick={handleParticipateClick}
                        >
                            선택한 리워드로 펀딩 신청하기
                        </button>
                    </div>


                </div>
            </div>



        </Section >
    );
};

export default FundInfoPage;
