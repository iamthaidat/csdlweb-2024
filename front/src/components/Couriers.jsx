import React, { useState, useEffect } from 'react';
import './styles/AdminPanel.css';

function Couriers({ token }) {
    const [couriers, setCouriers] = useState([]);
    const [editingCourierId, setEditingCourierId] = useState(null);
    const [editedCourier, setEditedCourier] = useState({
        rating: '',
        rate: '',
        location: '',
        number_of_marks: '',
        user_email: '',
        user_username: '',
        user_registration_date: '',
        user_is_active: false,
        role_name: ''
    });
    const [error, setError] = useState('');

    useEffect(() => {
        fetchCouriers();
    }, []);

    const fetchCouriers = async () => {
        try {
            const response = await fetch('http://127.0.0.1:8000/admins/couriers', {
                headers: { 'Authorization': `Bearer ${token}` },
            });

            if (response.ok) {
                const data = await response.json();
                setCouriers(data);
            } else {
                setError('Không thể tải thông tin người giao hàng');
            }
        } catch (error) {
            console.error('Error fetching couriers:', error);
            setError('Lỗi khi tải thông tin người giao hàng');
        }
    };

    const handleUpdateCourier = async () => {
        try {
            const response = await fetch(`http://127.0.0.1:8000/admins/courier/${editingCourierId}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    rating: editedCourier.rating,
                    rate: editedCourier.rate,
                    location: editedCourier.location,
                    number_of_marks: editedCourier.number_of_marks,
                }),
            });

            if (response.ok) {
                setEditingCourierId(null);
                setEditedCourier({
                    location: '',
                    user_email: '',
                    user_username: '',
                    user_registration_date: '',
                    user_is_active: false,
                    role_name: ''
                });
                fetchCouriers();
            } else {
                setError('Không thể cập nhật dữ liệu người giao hàng');
            }
        } catch (error) {
            console.error('Error updating courier:', error);
            setError('Lỗi khi cập nhật thông tin người giao hàng');
        }
    };

    const handleDeleteCourier = async (id) => {
        try {
            const response = await fetch(`http://127.0.0.1:8000/admins/courier/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` },
            });

            if (response.ok) {
                setCouriers(couriers.filter(courier => courier.id !== id));
            } else {
                setError('Không thể xóa người giao hàng');
            }
        } catch (error) {
            console.error('Error deleting courier:', error);
            setError('Lỗi khi xóa người giao hàng');
        }
    };

    return (
        <div>
            <h1>Người giao hàng</h1>
            {error && <p className="error">{error}</p>}
            <table className="couriers-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Vị trí</th>
                        <th>Email</th>
                        <th>Ngày đăng ký</th>
                        <th>Hoạt động</th>
                        <th>Vai trò</th>
                        <th>Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    {couriers.map(courier => (
                        <tr key={courier.id}>
                            <td>{courier.id}</td>
                            <td>
                                {editingCourierId === courier.id ? (
                                    <input
                                        type="text"
                                        value={editedCourier.location}
                                        onChange={(e) => setEditedCourier({ ...editedCourier, location: e.target.value })}
                                    />
                                ) : (
                                    courier.location
                                )}
                            </td>
                            <td>{editingCourierId === courier.id ? (
                                <input
                                    type="text"
                                    value={editedCourier.user_email}
                                    onChange={(e) => setEditedCourier({ ...editedCourier, user_email: e.target.value })}
                                />
                            ) : (
                                courier.user.email
                            )}
                            </td>
                            <td>{editingCourierId === courier.id ? (
                                <input
                                    type="date"
                                    value={editedCourier.user_registration_date}
                                    onChange={(e) => setEditedCourier({ ...editedCourier, user_registration_date: e.target.value })}
                                />
                            ) : (
                                new Date(courier.user.registration_date).toLocaleDateString()
                            )}
                            </td>
                            <td>{editingCourierId === courier.id ? (
                                <input
                                    type="checkbox"
                                    checked={editedCourier.user_is_active}
                                    onChange={(e) => setEditedCourier({ ...editedCourier, user_is_active: e.target.checked })}
                                />
                            ) : (
                                courier.user.is_active ? 'Đang hoạt động' : 'Không hoạt động'
                            )}
                            </td>
                            <td>{editingCourierId === courier.id ? (
                                <input
                                    type="text"
                                    value={editedCourier.role_name}
                                    onChange={(e) => setEditedCourier({ ...editedCourier, role_name: e.target.value })}
                                />
                            ) : (
                                courier.role.name
                            )}
                            </td>
                            <td>
                                {editingCourierId === courier.id ? (
                                    <>
                                        <button onClick={handleUpdateCourier}>Lưu</button>
                                        <button onClick={() => setEditingCourierId(null)}>Hủy</button>
                                    </>
                                ) : (
                                    <>
                                        <button onClick={() => {
                                            setEditingCourierId(courier.id);
                                            setEditedCourier({
                                                rating: courier.rating,
                                                rate: courier.rate,
                                                location: courier.location,
                                                number_of_marks: courier.number_of_marks,
                                                user_email: courier.user.email,
                                                user_username: courier.user.username,
                                                user_registration_date: new Date(courier.user.registration_date).toLocaleDateString(),
                                                user_is_active: courier.user.is_active,
                                                role_name: courier.role.name
                                            });
                                        }}>Chỉnh sửa</button>
                                        <button onClick={() => handleDeleteCourier(courier.id)}>Xóa</button>
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

export default Couriers;
