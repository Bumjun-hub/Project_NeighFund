import React, { useEffect, useRef, useState } from 'react';
import './FundPage.css';
import Section from '../../components/Section';
import FundCard from '../../components/FundCard';
import SurveyBox from '../../components/SurveyBox';

const FundPage = () => {
  const [funds, setFunds] = useState([]);
  const [visibleCount, setVisibleCount] = useState(4);
  const observerRef = useRef();

  const loadMore = () => {
    setVisibleCount((prev) => prev + 2);
  };

  useEffect(() => {
    fetch("/api/fund/view")
      .then((res) => res.json())
      .then((data) => setFunds(data))
      .catch((err) => console.error("펀딩 목록 불러오기 실패:", err));
  }, []);

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


  useEffect(() => {
    console.log("✅ useEffect 실행됨"); // useEffect 작동 확인

    fetch("/api/fund/view")
      .then((res) => {
        console.log("✅ fetch 응답 상태:", res.status); // 응답 코드 확인
        return res.json();
      })
      .then((data) => {
        console.log("🔥 받아온 펀딩 목록:", data); // 실제 데이터 확인
        setFunds(data);
      })
      .catch((err) => {
        console.error("❌ fetch 에러:", err);
      });
  }, []);


  return (
    <Section>
      <div className="fund-page-wrapper">
        <h2 className="fund-title">펀딩</h2>

        <div className="fund-surveys">
          <SurveyBox question="선호하는 활동이 있으신가요?" options={['운동', '먹거리']} />
          <SurveyBox question="어떤 유형의 펀딩이 가장 기대되시나요?" options={['생활용품', '디자인 소품', '식품', '기타']} />
        </div>

        <div className="fund-grid">
          {funds.slice(0, visibleCount).map((fund) => {
            console.log("펀딩 항목:", fund); // ✅ 이거 추가
            return <FundCard key={fund.id} fund={fund} />;
          })}
        </div>

        <div ref={observerRef} style={{ height: 1 }}></div>
      </div>
    </Section>
  );
};

export default FundPage;
