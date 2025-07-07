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
  const [isAdmin, setIsAdmin] = useState(false);
  const [surveys, setSurveys] = useState([]);

  const observerRef = useRef();


  const loadMore = () => {
    setVisibleCount((prev) => prev + 2);
  };


  // 펀딩 작성 버튼 클릭
  const handleWriteClick = () => {
    navigate("/funding/create/terms");
  }


  // 설문조사 작성 버튼 클릭 
  const handleSurveyWriteClick = () => {
    navigate("/survey/write")
  }

  // 펀딩 목록 로드
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

  useEffect(() => {
    fetch("/api/auth/roleinfo", {
      credentials: "include"
    })
      .then(res => res.json())
      .then(data => {
        if (data.roleName === "ROLE_ADMIN") setIsAdmin(true);
      })
      .catch(err => console.error("권한 확인 실패", err));
  }, []);


  useEffect(() => {
    fetch("/api/survey/view", { credentials: 'include' })
      .then(res => res.json())
      .then(data => {
        console.log("🧪 설문 목록:", data);  // 🔥 확인용
        if (Array.isArray(data)) setSurveys(data);
      })
      .catch(err => console.error("설문조사 목록 불러오기 실패", err));
  }, []);

  return (
    <Section>
      <div className="fund-page-wrapper">
        <div className='fund-header'>
          <h2 className="fund-title">펀딩</h2>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button className="write-btn" onClick={handleWriteClick}>+ 펀딩 글쓰기</button>
            {isAdmin && (
              <button className="write-btn" onClick={handleSurveyWriteClick}>+ 설문조사 글쓰기</button>
            )}
          </div>
        </div>
        {/* 설문조사 목록 */}
        <div className="fund-surveys">
          {surveys.map((survey) => (
            <SurveyBox
              key={survey.surveyId}
              question={survey.title}
              options={survey.options}
              surveyId={survey.surveyId}
              voted={survey.voted}
              totalCount={survey.totalCount}
              setSurveys={setSurveys}
              surveys={surveys}
            />
          ))}
        </div>

        {/* 펀딩 카드 목록  */}
        <div className="fund-grid">
          {Array.isArray(funds) &&
            funds.slice(0, visibleCount).map((fund) => {
              console.log("펀딩 항목:", fund);
              return <FundCard key={fund.id} fund={fund} />;
            })}
        </div>

        {/* 무한 스크롤 */}
        <div ref={observerRef} style={{ height: 1 }}></div>
      </div>
    </Section>
  );
};

export default FundPage;
