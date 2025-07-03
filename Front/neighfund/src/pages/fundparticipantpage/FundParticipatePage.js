import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import FundParticipateBankStep from "./FundParticipateBankStep";
import FundParticipateInfoStep from "./FundParticipateInfoStep";
import FundParticipateNoticeStep from "./FundParticipateNoticeStep";

const FundParticipatePage = () => {


  // ✅ URL 파라미터에서 리워드 정보 가져오기
  const queryParams = new URLSearchParams(window.location.search);
  const fundId = Number(queryParams.get("id"));
  const optionId = Number(queryParams.get("optionId"));
  const rewardTitle = queryParams.get("title");
  const rewardAmount = Number(queryParams.get("amount"));

  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    name: "",
    quantity: 1,
    address: "",
    detailAddress: "",
    phone: "",
    paymentName: "",
    paymentBank: "",
    rewardTitle: rewardTitle || "", // 리워드명 UI에 표시용
  });
  const [fund, setFund] = useState(null);

  useEffect(() => {
    if (!fundId || isNaN(fundId)) return; // 보호코드
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
          optionId={optionId}       //  ParticipationDto 전송에 사용
          salePrice={rewardAmount}  //  총 금액 계산용
        />
      )}
      {step === 3 && (
        <FundParticipateBankStep
          form={form}
        />
      )}
    </div>
  );
};

export default FundParticipatePage;
