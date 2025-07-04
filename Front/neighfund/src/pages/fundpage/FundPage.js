import React, { useEffect, useRef, useState } from 'react';
import './FundPage.css';
import Section from '../../components/Section';
import FundCard from '../../components/FundCard';
import SurveyBox from '../../components/SurveyBox';
import { useNavigate } from 'react-router-dom';

const FundPage = () => {

  const navigate = useNavigate();

  const [funds, setFunds] = useState([]); // ✅ 기본값 빈 배열
  const [visibleCount, setVisibleCount] = useState(4);
  const observerRef = useRef();

  const loadMore = () => {
    setVisibleCount((prev) => prev + 2);
  };

  const handleWriteClick = () => {
    navigate("/funding/create/terms");
  }

  useEffect(() => {
    fetch("/api/fund/view")
      .then((res) => res.json())
      .then((data) => {
        console.log("🔥 받아온 펀딩 목록:", data);
        if (Array.isArray(data)) {
          setFunds(data);
        } else {
          console.error("🚨 응답이 배열이 아닙니다:", data);
          setFunds([]); // 안전 처리
        }
      })
      .catch((err) => {
        console.error("❌ 펀딩 목록 불러오기 실패:", err);
        setFunds([]);
      });
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

  return (
    <Section>
      <div className="fund-page-wrapper">
        <div className='fund-header'>
          <h2 className="fund-title">펀딩</h2>
          <button className="write-btn" onClick={handleWriteClick}>+ 펀딩 글쓰기</button>
        </div>
        <div className="fund-surveys">
          <SurveyBox question="선호하는 활동이 있으신가요?" options={['운동', '먹거리']} />
          <SurveyBox question="어떤 유형의 펀딩이 가장 기대되시나요?" options={['생활용품', '디자인 소품', '식품', '기타']} />
        </div>

        <div className="fund-grid">
          {Array.isArray(funds) &&
            funds.slice(0, visibleCount).map((fund) => {
              console.log("펀딩 항목:", fund);
              return <FundCard key={fund.id} fund={fund} />;
            })}
        </div>

        <div ref={observerRef} style={{ height: 1 }}></div>
      </div>
    </Section>
  );
};

export default FundPage;
