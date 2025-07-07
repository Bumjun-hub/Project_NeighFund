import './FundParticipatePage.css';

const FundParticipateBankStep = ({ form }) => {
  const handleClose = () => {
    if (window.opener && !window.opener.closed) {
      window.opener.location.reload();
    }
    window.close();
  };

  return (
    <div className="bank-step">
      <h2>입금 안내</h2>
      <div className="bank-info-box">
        <label>가상계좌</label>
        <input value="1234-5678-9012" readOnly />
        <label>예금주</label>
        <input value="NeighFund" readOnly />
        <label>은행명</label>
        <input value="카카오뱅크" readOnly />
      </div>

      <div className="summary-info" style={{ marginTop: "20px" }}>
        {form?.rewardTitle && <p><strong>리워드:</strong> {form.rewardTitle}</p>}
        <p><strong>수량:</strong> {form.quantity}</p>
        <p><strong>입금자명:</strong> {form.paymentName}</p>
        <p><strong>연락처:</strong> {form.phone}</p>
      </div>

      <div className="bank-info-notice" style={{ margin: "24px 0", fontSize: "14px" }}>
        <b>
          🎉 참여 신청이 완료되었습니다!<br /><br />
          본 펀딩은 <strong>마감일 이후</strong>에 입금 여부를 확인하여<br />
          <strong>참여가 최종 확정</strong>됩니다.<br /><br />
          아래 계좌로 마감일까지 입금해주세요.<br />
          미입금 시 참여가 취소될 수 있습니다.
        </b>
      </div>

      <button onClick={handleClose}>창 닫기</button>
    </div>
  );
};

export default FundParticipateBankStep;
