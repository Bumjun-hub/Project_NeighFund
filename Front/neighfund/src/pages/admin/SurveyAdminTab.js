import './AdminStyles.css';

const SurveyAdminTab = ({ surveys, handleSurveyVisibleChange }) => {
  return (
    <div className="survey-admin">
      <h2>📊 설문 관리</h2>
      <ul>
        {surveys.map((survey) => {
          const total = survey.totalVotes || 0;

          return (
            <li key={survey.surveyId} className="survey-item">
              <div style={{ marginBottom: '5px' }}>
                <strong>📌 질문: </strong> {survey.title}
                <br />
                <strong>상태: </strong> {survey.visible ? '공개' : '비공개'} | 총 투표수: {total}
                <br />
                <label>설문 공개 상태 변경: </label>
                <select
                  value={survey.visible ? 'true' : 'false'}
                  onChange={(e) => handleSurveyVisibleChange(survey.surveyId, e.target.value)}
                >
                  <option value="true">공개</option>
                  <option value="false">비공개</option>
                </select>
              </div>

              <ul style={{ marginTop: '10px', marginBottom: '20px' }}>
                {survey.options && survey.options.map((opt) => {
                  const percentage = total === 0 ? 0 : ((opt.voteCount / total) * 100).toFixed(1);
                  return (
                    <li key={opt.optionId}>
                      🟢 {opt.content} - {opt.voteCount}표 ({percentage}%)
                    </li>
                  );
                })}
              </ul>

              <hr />
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default SurveyAdminTab;
