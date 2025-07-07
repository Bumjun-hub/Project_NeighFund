import React, { useEffect, useState } from 'react';
import './SurveyBox.css';
import { refreshToken } from '../utils/authUtils';

const SurveyBox = ({ question, options, surveyId, voted, showResult, totalCount, surveys, setSurveys }) => {
  const [selected, setSelected] = useState(null);
  const [result, setResult] = useState([]);
  const [totalVotes, setTotalVotes] = useState(totalCount || 0);

  // 이미 투표한 경우 표시
  useEffect(() => {
    if (voted) {
      setSelected(options.findIndex(opt => opt.selected));
      const total = options.reduce((sum, opt) => sum + opt.voteCount, 0);
      const percentages = options.map(opt =>
        total === 0 ? 0 : Math.round((opt.voteCount / total) * 100)
      );
      setResult(percentages);
      setTotalVotes(total);
    }
  }, [voted, options]);

  const handleVote = async (optionIndex) => {
    try {
      let res = await fetch(`/api/survey/${surveyId}/vote?optionId=${options[optionIndex].optionId}`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
      });

      if (res.status === 401) {
        const refreshed = await refreshToken();
        if (refreshed) {
          res = await fetch(`/api/survey/${surveyId}/vote?optionId=${options[optionIndex].optionId}`, {
            method: 'POST',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
          });
        }
      }

      if (res.ok) {
        const data = await res.json(); // { options: [...], totalParticipants }

        setSelected(optionIndex);

        // 🔥 백엔드에서 온 options에서 percentage 꺼내기
        const percentages = data.options.map(opt => opt.percentage);

        setResult(percentages);
        setTotalVotes(data.totalParticipants);

        const updated = surveys.map(s => {
          if (s.surveyId !== surveyId) return s;

          const updatedOptions = data.options.map((opt, idx) => ({
            ...opt,
            selected: idx === optionIndex
          }));

          return {
            ...s,
            voted: true,
            totalCount: data.totalParticipants,
            options: updatedOptions
          };
        });

        setSurveys(updated);
      }
      else {
        const msg = await res.text();
        alert('투표 실패: ' + msg);
      }

    } catch (err) {
      console.error("투표 요청 오류", err);
      alert("서버 오류 발생");
    }
  };

  return (
    <div className="survey-box">
      <p className="survey-question">{question}</p>
      <div className="survey-options">
        {options.map((option, index) => (
          <div
            key={index}
            className={`survey-option ${selected === index ? 'selected' : ''}`}
            onClick={() => {
              if (selected === null && !voted) handleVote(index);
            }}
          >
            <span>{option.content}</span>
            {(voted || result.length > 0 || showResult) && result[index] !== undefined && (
              <div className="vote-bar-container">
                <div
                  className="vote-bar"
                  style={{ width: `${result[index]}%` }}
                ></div>
                <span className="vote-percent">{result[index]}%</span>
              </div>
            )}
          </div>
        ))}
      </div>
      {(voted || result.length > 0) && (
        <p style={{ fontSize: '13px', textAlign: 'right' }}>
          총 참여자 수: {totalVotes}명
        </p>
      )}
    </div>
  );
};

export default SurveyBox;
