import './FundParticipatePage.css';


import { useState } from 'react';

const FundParticipateNoticeStep = ({ onNext, deadline }) => {
  const [checked, setChecked] = useState(false);

  return (
    <div className="notice-step">
      <h2>펀딩 참여 안내</h2>
      <div className="notice-box">
        <ul>
          <li>
            💡 본 펀딩은 {deadline?.split("T")[0]}까지 진행되며,
            마감 후 환불이나 취소는 불가합니다.
          </li>
          <li>
            💳 신청 완료 후 아래 가상계좌로 입금해주시면,
            관리자가 수동으로 확인 후 참여가 완료됩니다.
          </li>
          <li>
            ❗ 반드시 입금자명과 동일한 이름으로 입력해주세요.
          </li>
        </ul>
      </div>
      <label className="check-label">
        <input
          type="checkbox"
          checked={checked}
          onChange={e => setChecked(e.target.checked)}
        />
        안내사항을 모두 확인했습니다
      </label>
      <button className="next-btn" disabled={!checked} onClick={onNext}>
        다음
      </button>
    </div>
  );
};

export default FundParticipateNoticeStep;
