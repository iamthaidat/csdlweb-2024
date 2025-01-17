import React, { useState, useEffect } from 'react';
import './styles/AdminPanel.css';

function Customers({ token }) {
    const [customers, setCustomers] = useState([]);
    const [users, setUsers] = useState([]);
    const [mergedData, setMergedData] = useState([]);
    const [editingCustomerId, setEditingCustomerId] = useState(null);
    const [editedCustomer, setEditedCustomer] = useState({ balance: '', location: '' });
    const [error, setError] = useState('');

    useEffect(() => {
        fetchCustomers();
        fetchUsers();
    }, []);

    const fetchCustomers = async () => {
        try {
            const response = await fetch('http://127.0.0.1:8000/admins/customers', {
                headers: { 'Authorization': `Bearer ${token}` },
            });

            if (response.ok) {
                const data = await response.json();
                setCustomers(data);
            } else {
                setError('Không thể tải khách hàng');
            }
        } catch (error) {
            console.error('Error fetching customers:', error);
            setError('Lỗi khi tải khách hàng');
        }
    };

    const fetchUsers = async () => {
        try {
            const response = await fetch('http://127.0.0.1:8000/admins/users', {
                headers: { 'Authorization': `Bearer ${token}` },
            });

            if (response.ok) {
                const data = await response.json();
                setUsers(data);
            } else {
                setError('Không thể tải người dùng');
            }
        } catch (error) {
            console.error('Error fetching users:', error);
            setError('Lỗi khi tải người dùng');
        }
    };

    // Kết hợp dữ liệu khách hàng và người dùng
    useEffect(() => {
        if (customers.length > 0 && users.length > 0) {
            const merged = customers.map(customer => {
                const user = users.find(user => user.id === customer.id) || {};
                return {
                    ...customer,
                    email: user.email || 'N/A',
                    username: user.username || 'N/A',
                };
            });
            setMergedData(merged);
        }
    }, [customers, users]);

    const handleUpdateCustomer = async () => {
        try {
            const response = await fetch(`http://127.0.0.1:8000/admins/customer/${editingCustomerId}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(editedCustomer),
            });

            if (response.ok) {
                setEditingCustomerId(null);
                setEditedCustomer({ balance: '', location: '' });
                fetchCustomers();
            } else {
                setError('Không thể cập nhật dữ liệu khách hàng');
            }
        } catch (error) {
            console.error('Error updating customer:', error);
            setError('Lỗi khi cập nhật khách hàng');
        }
    };

    const handleDeleteCustomer = async (id) => {
        try {
            const response = await fetch(`http://127.0.0.1:8000/admins/customer/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` },
            });

            if (response.ok) {
                setCustomers(customers.filter(customer => customer.id !== id));
            } else {
                setError('Không thể xóa khách hàng');
            }
        } catch (error) {
            console.error('Error deleting customer:', error);
            setError('Lỗi khi xóa khách hàng');
        }
    };

    return (
        <div>
            <h1>Khách hàng</h1>
            {error && <p className="error">{error}</p>}
            <table className="customers-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Email</th>
                        <th>Tên đăng nhập</th>
                        <th>Số dư</th>
                        <th>Vị trí</th>
                        <th>Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    {mergedData.map(customer => (
                        <tr key={customer.id}>
                            <td>{customer.id}</td>
                            <td>{customer.email}</td>
                            <td>{customer.username}</td>
                            <td>
                                {editingCustomerId === customer.id ? (
                                    <input
                                        type="number"
                                        value={editedCustomer.balance}
                                        onChange={(e) => setEditedCustomer({ ...editedCustomer, balance: e.target.value })}
                                    />
                                ) : (
                                    customer.balance
                                )}
                            </td>
                            <td>
                                {editingCustomerId === customer.id ? (
                                    <input
                                        type="text"
                                        value={editedCustomer.location}
                                        onChange={(e) => setEditedCustomer({ ...editedCustomer, location: e.target.value })}
                                    />
                                ) : (
                                    customer.location
                                )}
                            </td>
                            <td>
                                {editingCustomerId === customer.id ? (
                                    <>
                                        <button onClick={handleUpdateCustomer}>Lưu</button>
                                        <button onClick={() => setEditingCustomerId(null)}>Hủy</button>
                                    </>
                                ) : (
                                    <>
                                        <button onClick={() => {
                                            setEditingCustomerId(customer.id);
                                            setEditedCustomer({ balance: customer.balance, location: customer.location });
                                        }}>Chỉnh sửa</button>
                                        <button onClick={() => handleDeleteCustomer(customer.id)}>Xóa</button>
                                    </>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default Customers;
