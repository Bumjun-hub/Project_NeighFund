import AddressInput from "../memberpage/AddressInput";
import { useState } from "react";
import './FundParticipatePage.css';


const FundParticipateInfoStep = ({ form, setForm, onNext, onPrev, optionId, salePrice }) => {
  const [loading, setLoading] = useState(false);

  // 연락처 자동 하이픈 처리
  const formatPhone = (value) => {
    const onlyNums = value.replace(/[^0-9]/g, '');
    if (onlyNums.length < 4) return onlyNums;
    if (onlyNums.length < 7) return onlyNums.slice(0, 3) + '-' + onlyNums.slice(3);
    return onlyNums.slice(0, 3) + '-' + onlyNums.slice(3, 7) + '-' + onlyNums.slice(7, 11);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "phone") {
      setForm(prev => ({ ...prev, phone: formatPhone(value) }));
    } else if (name === "quantity") {
      const safeVal = Math.max(1, Number(value));
      setForm(prev => ({ ...prev, quantity: safeVal }));
    } else {
      setForm(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleAddressChange = addr => setForm(prev => ({ ...prev, address: addr }));
  const handleDetailAddressChange = detailAddr => setForm(prev => ({ ...prev, detailAddress: detailAddr }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem("accessToken");
      const res = await fetch(`/api/orders/${optionId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          quantity: Number(form.quantity),
          name: form.name,
          address: form.address,
          detailAddress: form.detailAddress,
          phone: form.phone,
          paymentName: form.paymentName,
          paymentBank: form.paymentBank
        }),
      });

      setLoading(false);
      if (res.ok) {
        alert("🎉 참여 신청이 완료되었습니다!");
        onNext();
      } else {
        const msg = await res.text();
        alert("❌ 신청 실패: " + msg);
      }
    } catch (err) {
      setLoading(false);
      alert("⚠️ 네트워크 오류: " + err.message);
    }
  };

  const unitPrice = Number(salePrice) || 0;
  const quantity = Number(form.quantity) || 1;
  const totalAmount = unitPrice * quantity;

  return (
    <div className="info-step">
      <h2>참여 정보 입력</h2>
      <form onSubmit={handleSubmit} className="payment-form">
        {form.rewardTitle && (
          <div>
            <label>선택한 리워드</label>
            <input value={form.rewardTitle} readOnly style={{ background: '#f9f9f9' }} />
          </div>
        )}

        <div>
          <label>이름</label>
          <input value={form.name || ""} name="name" onChange={handleChange} required />
        </div>

        <div>
          <label>수량</label>
          <input
            type="number"
            name="quantity"
            min={1}
            value={form.quantity}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label>총 결제금액</label>
          <input
            value={totalAmount.toLocaleString() + "원"}
            readOnly
            tabIndex={-1}
            style={{ background: "#f5f7fb" }}
          />
        </div>

        <AddressInput
          address={form.address}
          detailAddress={form.detailAddress}
          onAddressChange={handleAddressChange}
          onDetailAddressChange={handleDetailAddressChange}
          required
          label="배송지"
        />

        <div>
          <label>연락처</label>
          <input
            type="text"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            placeholder="010-0000-0000"
            maxLength={13}
            required
          />
        </div>

        <div>
          <label>입금자명</label>
          <input
            type="text"
            name="paymentName"
            value={form.paymentName}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label>입금은행</label>
          <input
            type="text"
            name="paymentBank"
            value={form.paymentBank}
            onChange={handleChange}
            required
          />
        </div>

        <div style={{ marginTop: 24 }}>
          <button type="button" onClick={onPrev} disabled={loading}>이전</button>
          <button type="submit" style={{ marginLeft: 16 }} disabled={loading}>
            {loading ? "신청 중..." : "다음"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default FundParticipateInfoStep;
