import './AdminStyles.css';

const FundAdminTab = ({
  unapprovedFunds = [],
  approvedFunds = [],
  fundMode,
  setFundMode,
  selectedFund,
  setSelectedFund,
  handleSelectFund,
  handleApprove,
}) => {
  const fundsToShow = (fundMode === 'unapproved' ? unapprovedFunds : approvedFunds) || [];

  return (
    <div>
      <div className="tab-buttons">
        <button
          className={fundMode === 'unapproved' ? 'active' : ''}
          onClick={() => {
            setFundMode('unapproved');
            setSelectedFund(null);
          }}
        >
          📝 미승인 펀딩
        </button>
        <button
          className={fundMode === 'approved' ? 'active' : ''}
          onClick={() => {
            setFundMode('approved');
            setSelectedFund(null);
          }}
        >
          ✅ 승인된 펀딩
        </button>
      </div>

      <div className="fund-list">
        <h3>{fundMode === 'unapproved' ? '📋 미승인 목록' : '📦 승인된 목록'}</h3>
        <ul>
          {fundsToShow.map((f) => (
            <li key={f.id} onClick={() => handleSelectFund(f)}>
              <img
                src={f.fundImages?.[0] || f.imageUrl || '/default-thumbnail.png'}
                alt="썸네일"
                width="80"
                height="60"
              />
              <span style={{ marginLeft: 10 }}>
                <strong>{f.title}</strong> ({f.fundStatus})
              </span>
            </li>
          ))}
        </ul>
      </div>

      {selectedFund && (
        <div className="fund-detail">
          <h3>📌 상세 정보</h3>
          <p><strong>제목:</strong> {selectedFund.title}</p>
          <p><strong>작성자:</strong> {selectedFund.username}</p>
          <p><strong>상태:</strong> {selectedFund.fundStatus}</p>
          <p><strong>마감일:</strong> {selectedFund.deadline?.split('T')[0]}</p>
          <p><strong>참여자 수:</strong> {selectedFund.currentParticipants}</p>
          <p><strong>목표 금액:</strong> {selectedFund.targetAmount?.toLocaleString()}원</p>
          <p><strong>현재 금액:</strong> {selectedFund.currentAmount?.toLocaleString()}원</p>

          <h4>📸 대표 이미지</h4>
          {(selectedFund.fundImages || []).map((url, i) => (
            <img key={i} src={url} alt={`img-${i}`} style={{ width: 150, marginRight: 8 }} />
          ))}

          <h4>🖼 상세 이미지</h4>
          {(selectedFund.contentImgUrls || []).map((url, i) => (
            <img key={i} src={url} alt={`content-${i}`} style={{ width: 150, marginRight: 8 }} />
          ))}

          <h4>🎁 리워드 목록</h4>
          <ul>
            {(selectedFund.options || []).map((opt) => (
              <li key={opt.id}>
                <strong>{opt.title}</strong> - {opt.price.toLocaleString()}원 / 재고: {opt.quantity}
                <p>{opt.description}</p>
              </li>
            ))}
          </ul>

          {fundMode === 'unapproved' && (
            <button onClick={() => handleApprove(selectedFund.id)}>✅ 승인하기</button>
          )}
        </div>
      )}
    </div>
  );
};

export default FundAdminTab;
