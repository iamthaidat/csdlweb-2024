import React, {useState, useEffect} from 'react';
import {Button, Modal, message, Spin} from 'antd';
import Header from './Header'; // Import thành phần Header
import './styles/CourierPage.css';

const CourierPage = () => {
    const [orders, setOrders] = useState([]);
    const [assignedOrders, setAssignedOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [token, setToken] = useState('');
    const [courierLocation, setCourierLocation] = useState('');
    const [orderInfo, setOrderInfo] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [currentOrderId, setCurrentOrderId] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false); // Để kiểm tra xác thực
    const [roleId, setRoleId] = useState(2); // Vai trò của người giao hàng

    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        if (storedToken) {
            setToken(storedToken);
            setIsAuthenticated(true); // Người dùng đã được xác thực
            fetchOrders(storedToken);
            fetchAssignedOrders(storedToken);
        } else {
            setError('Lỗi trốngtrống');
            setLoading(false);
        }
    }, []);

    const fetchOrders = async (token) => {
        try {
            const response = await fetch('http://127.0.0.1:8000/courier/orders/not_delivered', {
                method: 'GET',
                headers: {
                    'accept': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (response.ok) {
                const data = await response.json();
                setOrders(data);
            } else {
                throw new Error(`Lỗi ${response.status}: Không thể nhận đơn hàng 1`);
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const fetchAssignedOrders = async (token) => {
        try {
            const response = await fetch('http://127.0.0.1:8000/courier/orders/assigned', {
                method: 'GET',
                headers: {
                    'accept': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (response.ok) {
                const data = await response.json();
                setAssignedOrders(data);
            } else {
                const data = {}
            }
        } catch (err) {
            setError(err.message);
        }
    };

    const fetchOrderInfo = async (orderId) => {
        try {
            const response = await fetch(`http://127.0.0.1:8000/courier/orders/${orderId}/info`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (response.ok) {
                const data = await response.json();
                setOrderInfo(data);
                setCurrentOrderId(orderId);
                setIsModalVisible(true);
            } else {
                throw new Error(`Lỗi ${response.status}: Không thể lấy thông tin đơn hàng`);
            }
        } catch (err) {
            setError(err.message);
        }
    };

    const closeModal = () => {
        setIsModalVisible(false);
        setOrderInfo(null);
    };

    const handleTakeOrder = async (orderId) => {
        if (!courierLocation) {
            alert('Vui lòng cung cấp vị trí của bạn.');
            return;
        }

        try {
            const response = await fetch(`http://127.0.0.1:8000/courier/orders/${orderId}/take?courier_location=${encodeURIComponent(courierLocation)}`, {
                method: 'POST',
                headers: {
                    'accept': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (response.ok) {
                alert(`Đơn hàng ${orderId} Đã nhận thành công!`);
                fetchOrders(token);
                fetchAssignedOrders(token);
            } else {
                const errorData = await response.json();
                throw new Error(`Lỗi ${response.status}: ${errorData.detail || 'Lỗi không xác định'}`);
            }
        } catch (err) {
            setError(err.message);
        }
    };

    const handleDeliverOrder = async (orderId) => {
        try {
            const response = await fetch(`http://127.0.0.1:8000/courier/${orderId}/deliver`, {
                method: 'PUT',
                headers: {
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    order_id: orderId,
                    is_prepared: true,
                    is_delivered: true,
                }),
            });

            if (response.ok) {
                alert(`Đơn hàng ${orderId} Đã giao thành công!`);
                fetchAssignedOrders(token); // Cập nhật các đơn hàng được giao
            } else {
                console.error('Không thể giao đơn hàng');
            }
        } catch (error) {
            console.error('Lỗi:', error);
        }
    };

    if (loading) return <div className="courier-loading-spinner"><Spin size="large"/></div>;
    if (error) return <div className="courier-error-message">Lỗi: {error}</div>;

    return (
    <div className="courier-page">
        {/* Header */}
        <Header
            isAuthenticated={isAuthenticated}
            handleLogout={() => {
                localStorage.removeItem('token');
                setIsAuthenticated(false);
                setToken('');
            }}
            role_id={roleId} // Vai trò của người giao hàng
        />

        <div className="courier-header">
            <h1>Đơn giao hàng</h1>
            <div className="courier-location">
                <label htmlFor="courierLocation">Vị trí của người giao hàng: </label>
                <input
                    type="text"
                    id="courierLocation"
                    value={courierLocation}
                    onChange={(e) => setCourierLocation(e.target.value)}
                    placeholder="Nhập vị trí của bạn"
                />
            </div>
        </div>

        <div className="orders-container">
            {/* Đơn hàng khả dụng */}
            <div className="orders-section">
                <h2>Đơn hàng có sẵn</h2>
                {orders.length > 0 ? (
                    <div className="orders-grid">
                        {orders.map((order) => (
                            order.is_prepared && (
                                <div key={order.order_id} className="order-card">
                                    <p><strong>Số đơn hàng:</strong> {order.order_id}</p>
                                    <p><strong>Sẵn sàng:</strong> {order.is_prepared ? 'Vâng' : 'Không'}</p>
                                    <Button className="action-btn" onClick={() => handleTakeOrder(order.order_id)}>
                                    Nhận đơn hàng
                                    </Button>
                                    <Button className="action-btn" onClick={() => fetchOrderInfo(order.order_id)}>
                                    Xem chi tiết
                                    </Button>
                                </div>
                            )
                        ))}
                    </div>
                ) : (
                    <p className="no-orders-message">Không có đơn hàng nào để nhận.</p>
                )}
            </div>

            <hr className="orders-separator" />

            {/* Đơn hàng được giao */}
            <div className="orders-section">
                <h2>Đơn hàng được giao</h2>
                {assignedOrders.length > 0 ? (
                    <div className="orders-grid">
                        {assignedOrders
                            .sort((a, b) => a.is_delivered - b.is_delivered) // Sắp xếp theo trường is_delivered
                            .map((order) => (
                                <div key={order.order_id} className="order-card">
                                    <p><strong>Số đơn hàng:</strong> {order.order_id}</p>
                                    <p><strong>Sẵn sàng:</strong> {order.is_prepared ? 'Đúng' : 'Không'}</p>
                                    <p><strong>Đã giao:</strong> {order.is_delivered ? 'Đúng' : 'Không'}</p>

                                    {/* Hiển thị nút 'Đánh dấu là đã giao' chỉ cho các đơn hàng chưa được giao */}
                                    {!order.is_delivered && (
                                        <Button className="action-btn"
                                            onClick={() => handleDeliverOrder(order.order_id)}>
                                            Đánh dấu là đã giao
                                        </Button>
                                    )}

                                    <Button className="action-btn" onClick={() => fetchOrderInfo(order.order_id)}>
                                    Xem chi tiết
                                    </Button>
                                </div>
                            ))}
                    </div>
                ) : (
                    <p className="no-orders-message">Hiện tại bạn chưa có đơn hàng được giao.</p>
                )}
            </div>
        </div>

        <Modal
            title="Thông tin đơn hàng"
            visible={isModalVisible}
            onCancel={closeModal}
            footer={null}
            className="order-modal"
        >
            <div className="modal-content">
                {orderInfo ? (
                    <>
                        <p><strong>Chi phí:</strong> {orderInfo.cost}</p>
                        <p><strong>Ngày tạo:</strong> {orderInfo.creation_date}</p>
                        <p><strong>Cân nặng:</strong> {orderInfo.weight}</p>
                        <p><strong>Vị trí:</strong> {orderInfo.location}</p>
                    </>
                ) : (
                    <p>Đang tải chi tiết đơn hàng...</p>
                )}
            </div>
        </Modal>
    </div>
);

}

export default CourierPage;
