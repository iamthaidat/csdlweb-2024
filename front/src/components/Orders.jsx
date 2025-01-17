import React, { useState, useEffect } from 'react';
import './styles/AdminPanel.css';

function Orders({ token }) {
    const [orders, setOrders] = useState([]);
    const [error, setError] = useState('');
    const [updatingOrderId, setUpdatingOrderId] = useState(null);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const response = await fetch('http://127.0.0.1:8000/admins/order_statuses', {
                headers: { 'Authorization': `Bearer ${token}` },
            });

            if (response.ok) {
                const data = await response.json();
                setOrders(data);
            } else {
                setError('Không thể tải các đơn hàng');
            }
        } catch (err) {
            console.error('Lỗi khi tải các đơn hàng:', err);
            setError('Lỗi tải đơn hàng');
        }
    };

    const handleUpdateOrderStatus = async (orderId, updatedStatus) => {
        try {
            const response = await fetch(`http://127.0.0.1:8000/admins/order_status/${orderId}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedStatus),
            });

            if (response.ok) {
                fetchOrders(); // Tải lại danh sách đơn hàng sau khi cập nhật
                setUpdatingOrderId(null);
            } else {
                setError('Không thể cập nhật trạng thái đơn hàng');
            }
        } catch (err) {
            console.error('Lỗi khi cập nhật trạng thái đơn hàng:', err);
            setError('Lỗi cập nhật trạng thái đơn hàng');
        }
    };

    const handleStatusChange = (orderId, field) => {
        setOrders(prevOrders =>
            prevOrders.map(order =>
                order.order_id === orderId
                    ? { ...order, [field]: !order[field] }
                    : order
            )
        );
    };

    return (
        <div className="orders-container">
            <h1 className="page-title">Đơn hàng</h1>
            {error && <p className="error-message">{error}</p>}
            <div className="table-container">
                <table className="orders-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Trạng thái chế biến</th>
                            <th>Trạng thái giao hàng</th>
                            <th>Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map(order => (
                            <tr key={order.order_id}>
                                <td>{order.order_id}</td>
                                <td>{order.is_prepared ? 'Hoàn thành' : 'Chưa hoàn thành'}</td>
                                <td>{order.is_delivered ? 'Đã giao' : 'Chưa giao'}</td>
                                <td>
                                    <button
                                        className="edit-btn"
                                        onClick={() => setUpdatingOrderId(order.order_id)}
                                    >
                                        Thay đổi trạng thái
                                    </button>
                                    {updatingOrderId === order.order_id && (
                                        <div className="status-update">
                                            <label>
                                            Trạng thái chế biến:
                                                <input
                                                    type="checkbox"
                                                    checked={order.is_prepared}
                                                    onChange={() => handleStatusChange(order.order_id, 'is_prepared')}
                                                />
                                            </label>
                                            <label>
                                            Trạng thái giao hàng:
                                                <input
                                                    type="checkbox"
                                                    checked={order.is_delivered}
                                                    onChange={() => handleStatusChange(order.order_id, 'is_delivered')}
                                                />
                                            </label>
                                            <button
                                                className="save-btn"
                                                onClick={() => handleUpdateOrderStatus(order.order_id, {
                                                    is_prepared: order.is_prepared,
                                                    is_delivered: order.is_delivered
                                                })}
                                            >
                                                Lưu thay đổi
                                            </button>
                                        </div>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default Orders;
