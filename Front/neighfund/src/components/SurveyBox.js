import React, { useEffect, useState } from 'react';
import './SurveyBox.css'; // 필요시 css 분리
import { refreshToken } from '../utils/authUtils';

const SurveyBox = ({ question, options, surveyId }) => {
  const [selected, setSelected] = useState(null);
  const [result, setResult] = useState(null);
  const [totalVotes, setTotalVotes] = useState(0);

  const handleVote = async (optionIndex) => {
    try {
      let res = await fetch(`/api/survey/${surveyId}/vote`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answerIndex: optionIndex }),
      });

      if (res.status === 401) {
        const refreshed = await refreshToken();
        if (refreshed) {
          res = await fetch(`/api/survey/${surveyId}/vote`, {
            method: 'POST',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ answerIndex: optionIndex }),
          });
        }
      }

      if (res.ok) {
        const data = await res.json();
        setResult(data.percentages); // [75, 25]
        setTotalVotes(data.totalParticipants); // 예: 4
        setSelected(optionIndex);
      } else {
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
              if (selected === null) handleVote(index);
            }}
          >
            <span>{option}</span>
            {result && (
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
      {result && (
        <p style={{ fontSize: '13px', textAlign: 'right' }}>
          총 참여자 수: {totalVotes}명
        </p>
      )}
    </div>
  );
};

export default SurveyBox;
