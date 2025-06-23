import React, { useEffect, useRef, useState } from 'react';
import './FundPage.css';
import Section from '../../components/Section';
import FundCard from '../../components/FundCard';
import SurveyBox from '../../components/SurveyBox';

const dummyFunds = [
  {
    id: 1,
    title: '천연 방향제 펀딩',
    description: '시나몬, 오렌지로 만든 인테리어용 천연 방향제!',
    imageUrl: 'https://example.com/fund1.jpg',
    tag: '소확행',
  },
  {
    id: 2,
    title: '레트로 감성 액자 펀딩',
    description: '레트로 분위기 완성! 독립작가 감성 소품',
    imageUrl: 'https://example.com/fund2.jpg',
    tag: '디자인',
  },
  {
    id: 3,
    title: '건강한 간식 펀딩',
    description: '직접 구운 건강한 과일칩, 아이 간식용으로 최고!',
    imageUrl: 'https://example.com/fund3.jpg',
    tag: '식품',
  },
  {
    id: 4,
    title: '수공예 비누 펀딩',
    description: '천연 재료로 만든 고체비누, 환경도 생각했어요',
    imageUrl: 'https://example.com/fund4.jpg',
    tag: '생활용품',
  },
  {
    id: 5,
    title: '친환경 텀블러 펀딩',
    description: '디자인과 기능 모두 잡은 친환경 보틀!',
    imageUrl: 'https://example.com/fund5.jpg',
    tag: '에코',
  },
];

const FundPage = () => {
  const [visibleCount, setVisibleCount] = useState(4);
  const observerRef = useRef();

  const loadMore = () => {
    setVisibleCount((prev) => prev + 2);
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          loadMore();
        }
      },
      { threshold: 1 }
    );

    if (observerRef.current) observer.observe(observerRef.current);
    return () => {
      if (observerRef.current) observer.unobserve(observerRef.current);
    };
  }, []);

  return (
    <Section>
      <div className="fund-page-wrapper">
        <h2 className="fund-title">펀딩 제안</h2>

        {/* 설문 2개만 상단에 고정 */}
        <div className="fund-surveys">
          <SurveyBox
            question="선호하는 활동이 있으신가요?"
            options={['운동', '먹거리']}
          />
          <SurveyBox
            question="어떤 유형의 펀딩이 가장 기대되시나요?"
            options={['생활용품', '디자인 소품', '식품', '기타']}
          />
        </div>

        {/* 2열 펀딩 카드 그리드 */}
        <div className="fund-grid">
          {dummyFunds.slice(0, visibleCount).map((fund) => (
            <FundCard key={fund.id} fund={fund} />
          ))}
        </div>

        <div ref={observerRef} style={{ height: 1 }}></div>
      </div>
    </Section>
  );
};

export default FundPage;
