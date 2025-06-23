import { useNavigate } from 'react-router-dom';

const FundCard = ({ fund }) => {
  const navigate = useNavigate();

  return (
    <div className="fund-card">
      <img src={fund.imageUrl} alt={fund.title} className="fund-image" />
      <div className="fund-content">
        <span className="fund-tag">#{fund.tag}</span>
        <h3 className="fund-name">{fund.title}</h3>
        <p className="fund-desc">{fund.description}</p>
        <button className="fund-btn" onClick={() => navigate(`/funding/info/${fund.id}`)}>
          자세히 보기
        </button>
      </div>
    </div>
  );
};

export default FundCard;
