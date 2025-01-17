import { useEffect, useState } from 'react';
import { Button, Card, message, Spin, Modal } from 'antd';
import './styles/KitchenOrders.css';

function KitchenOrders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);
    const [updatingOrderId, setUpdatingOrderId] = useState(null);
    const [orderDetails, setOrderDetails] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);

    const getAuthToken = () => {
        return localStorage.getItem('token');
    };

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const token = getAuthToken();
            const response = await fetch('http://127.0.0.1:8000/kitchen_worker/orders/not_ready', {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                credentials: 'include',
            });
            if (!response.ok) {
                throw new Error('Failed to fetch orders');
            }
            const data = await response.json();
            setOrders(data);
        } catch (error) {
            console.error(error);
            message.error('Lỗi khi tải đơn hàng');
        } finally {
            setLoading(false);
        }
    };

    const markAsPrepared = async (orderId) => {
        setUpdatingOrderId(orderId);
        setLoading(true);
        try {
            const token = getAuthToken();
            const response = await fetch(`http://127.0.0.1:8000/kitchen_worker/${orderId}/prepare`, {
                method: 'PUT',
                headers: {
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                credentials: 'include',
            });
            if (!response.ok) {
                throw new Error('Failed to update order');
            }
            message.success(`Đơn hàng ${orderId} Đã được đánh dấu là hoàn thành`);
            fetchOrders();
        } catch (error) {
            console.error(error);
            message.error('Lỗi khi cập nhật đơn hàng');
        } finally {
            setLoading(false);
            setUpdatingOrderId(null);
        }
    };

    const fetchOrderDetails = async (orderId) => {
        try {
            const token = getAuthToken();
            const response = await fetch(`http://127.0.0.1:8000/kitchen_worker/orders/${orderId}`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });
            if (!response.ok) {
                throw new Error('Failed to fetch order details');
            }
            const data = await response.json();
            setOrderDetails(data);
            setIsModalVisible(true);
        } catch (error) {
            console.error(error);
            message.error('Lỗi khi tải chi tiết đơn hàng');
        }
    };

    const closeModal = () => {
        setIsModalVisible(false);
        setOrderDetails(null);
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        window.location.href = '/login';
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    return (
        <div className="orders-container">
            <div className="orders-header">
                <h1>Đơn hàng chưa hoàn thành</h1>
                {loading ? (
                    <Spin size="large" className="loading-spinner" />
                ) : (
                    <div className="orders-grid">
                        {orders.length === 0 ? (
                            <p className="no-orders-text">Không có đơn hàng chưa hoàn thành</p>
                        ) : (
                            orders.map(order => (
                                <Card key={order.order_id} className="order-card">
                                    <p className="order-id">Đơn hàng ID: {order.order_id}</p>
                                    <p>Trạng thái: {order.is_prepared ? 'Đã hoàn thành' : 'Chưa hoàn thành'}</p>
                                    <Button
                                        type="primary"
                                        className={`action-btn ${updatingOrderId === order.order_id ? 'processing' : ''}`}
                                        onClick={() => markAsPrepared(order.order_id)}
                                        disabled={updatingOrderId === order.order_id || order.is_prepared}
                                    >
                                        {updatingOrderId === order.order_id ? 'Đang xử lý...' : 'Hoàn thành'}
                                    </Button>
                                    <Button
                                        type="default"
                                        className="action-btn"
                                        onClick={() => fetchOrderDetails(order.order_id)}
                                    >
                                        Chi tiết hơn
                                    </Button>
                                </Card>
                            ))
                        )}
                    </div>
                )}
            </div>

            <Modal
                title="Chi tiết đơn hàng"
                visible={isModalVisible}
                onCancel={closeModal}
                footer={null}
            >
                <div>
                    <h3>Món ăn trong đơn hàng:</h3>
                    {orderDetails?.dishes && orderDetails.dishes.length > 0 ? (
                        orderDetails.dishes.map(dish => (
                            <div key={dish.dish.id} className="dish-details">
                                <span>{dish.dish.name} (x{dish.quantity})</span>
                                <span>Giá: {dish.dish.price} Đồng.</span>
                            </div>
                        ))
                    ) : (
                        <p>Không có món ăn trong đơn hàng</p>
                    )}
                </div>
            </Modal>

            <Button
                type="default"
                className="logout-btn"
                onClick={handleLogout}
            >
                Thoát
            </Button>
        </div>
    );
}

export default KitchenOrders;
