import './AdminStyles.css';

const OrderAdminTab = ({ orders = [], selectedFundId, handleOrderStatusChange }) => {
    console.log("📦 전체 주문:", orders);
    console.log("🎯 선택한 펀딩 ID:", selectedFundId);

    const filteredOrders = Array.isArray(orders)
        ? selectedFundId && selectedFundId !== 'ALL'
            ? orders.filter(order => String(order.fundId) === selectedFundId)
            : orders
        : [];

    return (
        <div className='order-admin'>
            <h3>📦 주문 목록</h3>
            {filteredOrders.length === 0 ? (
                <p>해당 펀딩에 대한 주문이 없습니다.</p>
            ) : (
                <ul>
                    {filteredOrders.map((order) => (
                        <li key={order.id}>
                            <p><strong>펀딩:</strong> {order.fundTitle}</p>
                            <p><strong>리워드:</strong> {order.optionTitle}</p>
                            <p><strong>수량:</strong> {order.quantity}</p>
                            <p><strong>주문자:</strong> {order.username}</p>
                            <p><strong>입금자명:</strong> {order.paymentName}</p>
                            <p><strong>은행명:</strong> {order.paymentBank}</p>
                            <p><strong>상태:</strong> {order.status}</p>
                            <select
                                value={order.status}
                                onChange={(e) => handleOrderStatusChange(order.id, e.target.value)}
                            >
                                <option value="PENDING">PENDING</option>
                                <option value="COMPLETED">COMPLETED</option>
                                <option value="CANCELED">CANCELED</option>
                            </select>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default OrderAdminTab;
