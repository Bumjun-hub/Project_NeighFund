const FundParticipateBankStep = () => {
  const handleClose = () => {
    if (window.opener && !window.opener.closed) {
      window.opener.location.reload();
    }
    window.close();
  };

  return (
    <div className="bank-step">
      <h2>입금(참여) 안내</h2>
      <div className="bank-info-box">
        <label>가상계좌</label>
        <input value="1234-5678-9012" readOnly />
        <label>예금주</label>
        <input value="NeighFund" readOnly />
        <label>은행명</label>
        <input value="카카오뱅크" readOnly />
      </div>
      <div style={{ margin: "24px 0" }}>
        <b>
          참여 신청이 완료되었습니다!<br />
          위 계좌로 입금해주시면 운영자가 확인 후 완료 처리됩니다.<br /><br />
          문의는 [운영자 이메일 또는 전화번호]로 주세요.
        </b>
      </div>
      <button onClick={handleClose}>창 닫기</button>
    </div>
  );
};

export default FundParticipateBankStep;
