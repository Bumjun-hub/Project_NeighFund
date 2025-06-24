import { useParams } from 'react-router-dom';
import { useState } from 'react';
import { dummyFunds } from '../../datas/dummydata';
import './FundInfoPage.css';
import Section from '../../components/Section';

const FundInfoPage = () => {
    const { id } = useParams();
    const fund = dummyFunds.find((item) => item.id === Number(id));
    const [activeTab, setActiveTab] = useState('intro');

    if (!fund) return <div className="not-found">해당 펀딩을 찾을 수 없습니다.</div>;

    return (
        <Section>
            <div className="fund-info-wrapper">
                <h2 className="fund-title">펀딩 상세</h2>

                <div className="fund-info-top">
                    <img src={fund.imageUrl} alt={fund.title} className="fund-info-image" />
                    <div className="fund-info-details">
                        <span className="fund-tag">#{fund.tag}</span>
                        <h3 className="fund-name">{fund.title}</h3>
                        <p className="fund-subtext">주민 제안에 의해 채택된 펀딩입니다</p>
                        <div className="fund-stats">
                            <p><strong>달성률:</strong> <span className="fund-highlight">{fund.fundingRate}%</span></p>
                            <p><strong>목표 금액:</strong> {fund.goalAmount}</p>
                            <p><strong>참여자 수:</strong> {fund.participants}명</p>
                            <p><strong>남은 기간:</strong> D-{fund.remainDays}</p>
                        </div>
                        <button className="fund-participate-btn">펀딩 참여</button>
                        <p className="fund-likes">♡ {fund.likeCount}</p>
                    </div>
                </div>

                {/* 펀딩 요약 정보 박스 */}
                <div className="fund-summary-box">
                    <div><strong>목표 금액:</strong> {fund.goalAmount}</div>
                    <div><strong>참여자 수:</strong> {fund.participants}명</div>
                    <div><strong>남은 시간:</strong> D-{fund.remainDays}</div>
                </div>

                {/* 탭 영역 */}
                <div className="fund-tabs">
                    <button className={activeTab === 'intro' ? 'active' : ''} onClick={() => setActiveTab('intro')}>소개</button>
                    <button className={activeTab === 'budget' ? 'active' : ''} onClick={() => setActiveTab('budget')}>예산</button>
                    <button className={activeTab === 'schedule' ? 'active' : ''} onClick={() => setActiveTab('schedule')}>프로젝트 일정</button>
                </div>

                <div className="fund-info-content">
                    {activeTab === 'intro' && (
                        <div className="fund-description-box">
                            {fund.detailText.split('\n').map((line, idx) => (
                                <p key={idx}>{line}</p>
                            ))}
                        </div>
                    )}

                    {activeTab === 'budget' && (
                        <div className="fund-description-box">
                            <p>이 펀딩의 목표 금액은 <strong>{fund.goalAmount}</strong>이며, 펀딩 금액은 제작비, 홍보비, 기부금 등으로 사용됩니다.</p>
                        </div>
                    )}

                    {activeTab === 'schedule' && (
                        <div className="fund-description-box">
                            <p>📌 펀딩 시작: 2025.06.20</p>
                            <p>📌 펀딩 마감: 2025.07.10</p>
                            <p>📦 리워드 발송 예정: 2025.07.25</p>
                        </div>
                    )}
                </div>
            </div>
        </Section>
    );
};

export default FundInfoPage;
