import React, { useEffect, useRef, useState } from 'react';
import './FundPage.css';
import Section from '../../components/Section';
import FundCard from '../../components/FundCard';
import SurveyBox from '../../components/SurveyBox';
import { dummyFunds } from '../../datas/dummydata';



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
        <h2 className="fund-title">펀딩</h2>

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
