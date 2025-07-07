import { useEffect, useState } from "react";
import FundParticipateBankStep from "./FundParticipateBankStep";
import FundParticipateInfoStep from "./FundParticipateInfoStep";
import FundParticipateNoticeStep from "./FundParticipateNoticeStep";
import './FundParticipatePage.css';

const FundParticipatePage = ({ fundId, optionId, rewardTitle, rewardAmount }) => {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    name: "",
    quantity: 1,
    address: "",
    detailAddress: "",
    phone: "",
    paymentName: "",
    paymentBank: "",
    rewardTitle: rewardTitle || "",
  });
  const [fund, setFund] = useState(null);

  useEffect(() => {
    if (!fundId || isNaN(fundId)) return;
    fetch(`/api/fund/view/${fundId}`)
      .then(res => res.json())
      .then(data => setFund(data));
  }, [fundId]);

  if (!fund) return <div>로딩중...</div>;

  return (
    <div className="participate-page">
      {step === 1 && (
        <FundParticipateNoticeStep
          onNext={() => setStep(2)}
          deadline={fund.deadline}
        />
      )}
      {step === 2 && (
        <FundParticipateInfoStep
          form={form}
          setForm={setForm}
          onNext={() => setStep(3)}
          onPrev={() => setStep(1)}
          fund={fund}
          optionId={optionId}
          salePrice={rewardAmount}
        />
      )}
      {step === 3 && (
        <FundParticipateBankStep form={form} />
      )}
    </div>
  );
};

export default FundParticipatePage;
