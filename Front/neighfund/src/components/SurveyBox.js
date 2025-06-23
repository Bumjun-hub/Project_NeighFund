// components/SurveyBox.js
import React, { useState } from 'react';
import './SurveyBox.css';

const SurveyBox = ({ question, options }) => {
  const [selected, setSelected] = useState(null);

  const handleSelect = (index) => {
    setSelected(index);
  };

  return (
    <div className="survey-box">
      <p className="survey-question">{question}</p>
      <div className="survey-options">
        {options.map((opt, idx) => (
          <button
            key={idx}
            className={`survey-option ${selected === idx ? 'selected' : ''}`}
            onClick={() => handleSelect(idx)}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SurveyBox;
