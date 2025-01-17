import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import './styles/AdminPanel.css';
import Header from './Header';
import DishCategories from './DishCategories';
import Dishes from './Dishes';
import Orders from './Orders';
import Customers from './Customers';
import Couriers from './Couriers';

function AdminPanel() {
    const location = useLocation();
    const [token, setToken] = useState('');
    const [role, setRole] = useState(localStorage.getItem('role'));
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [users, setUsers] = useState([]);
    const [error, setError] = useState('');
    const [activePage, setActivePage] = useState('users');

    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        if (storedToken) {
            setToken(storedToken);
            setIsAuthenticated(true);
            fetchUsers(storedToken);
        } else {
            const params = new URLSearchParams(location.search);
            const tokenFromUrl = params.get('token');
            if (tokenFromUrl) {
                setToken(tokenFromUrl);
                localStorage.setItem('token', tokenFromUrl);
                setIsAuthenticated(true);
                fetchUsers(tokenFromUrl);
            } else {
                setError('Không tìm thấy token');
            }
        }
    }, [location]);

    const fetchUsers = async (token) => {
        try {
            const response = await fetch('http://127.0.0.1:8000/admins/users', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (response.ok) {
                const data = await response.json();
                setUsers(data);
            } else {
                setError('Không thể tải người dùng');
            }
        } catch (error) {
            console.error('Lỗi khi tải người dùng:', error);
            setError('Lỗi khi tải người dùng');
        }
    };

    const handleDeleteUser = async (id) => {
        try {
            const response = await fetch(`http://127.0.0.1:8000/admins/user/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (response.ok) {
                setUsers(users.filter(user => user.id !== id));
            } else {
                setError('Không thể xóa người dùng');
            }
        } catch (error) {
            console.error('Lỗi khi xóa người dùng:', error);
            setError('Lỗi khi xóa người dùng');
        }
    };

    const handleUpdateUser = async (id, updatedData) => {
        try {
            const response = await fetch(`http://127.0.0.1:8000/admins/user/${id}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedData),
            });

            if (response.ok) {
                fetchUsers(token);
            } else {
                setError('Không thể cập nhật người dùng');
            }
        } catch (error) {
            console.error('Lỗi khi cập nhật người dùng:', error);
            setError('Lỗi khi cập nhật người dùng');
        }
    };

    return (
        <div className="admin-panel-container">
            <aside className="sidebar">
                <h2 className="sidebar-title">Bảng quản trị viên</h2>
                <ul className="sidebar-menu">
                    <li>
                        <a href="#" onClick={() => setActivePage('users')}
                           className={activePage === 'users' ? 'active' : ''}>
                            Người dùng
                        </a>
                    </li>
                    <li>
                        <a href="#" onClick={() => setActivePage('dish-categories')}
                           className={activePage === 'dish-categories' ? 'active' : ''}>
                            Danh mục món ăn
                        </a>
                    </li>
                    <li>
                        <a href="#" onClick={() => setActivePage('dishes')}
                           className={activePage === 'dishes' ? 'active' : ''}>
                            Món ăn
                        </a>
                    </li>
                    <li>
                        <a href="#" onClick={() => setActivePage('orders')}
                           className={activePage === 'orders' ? 'active' : ''}>
                            Đơn hàng
                        </a>
                    </li>
                    <li>
                        <a href="#" onClick={() => setActivePage('customers')}
                           className={activePage === 'customers' ? 'active' : ''}>
                            Khách hàng
                        </a>
                    </li>
                    <li>
                        <a href="#" onClick={() => setActivePage('couriers')}
                           className={activePage === 'couriers' ? 'active' : ''}>
                            Nhân viên giao hàng
                        </a>
                    </li>
                </ul>
            </aside>

            <main className="main-content">
                <Header isAuthenticated={isAuthenticated} role={role}/>
                {activePage === 'users' && (
                    <>
                        <h1>Người dùng </h1>
                        <table className="users-table">
                            <thead>
                            <tr>
                                <th>ID</th>
                                <th>Email</th>
                                <th>Tên đăng nhập</th>
                                <th>Vai trò</th>
                                <th>Thao tác</th>
                            </tr>
                            </thead>
                            <tbody>
                            {users.map(user => (
                                <tr key={user.id}>
                                    <td>{user.id}</td>
                                    <td>{user.email}</td>
                                    <td>{user.username}</td>
                                    <td>{user.role.name}</td>
                                    <td>
                                        <button onClick={() => handleUpdateUser(user.id, {is_active: !user.is_active})}>
                                            {user.is_active ? 'Hủy kích hoạt' : 'Kích hoạt'}
                                        </button>
                                        <button onClick={() => handleDeleteUser(user.id)}>Xóa</button>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </>
                )}
                {activePage === 'dish-categories' && <DishCategories token={token}/>}
                {activePage === 'dishes' && <Dishes token={token}/>}
                {activePage === 'orders' && <Orders token={token}/>}
                {activePage === 'customers' && <Customers token={token}/>} {/* Tab 'Khách hàng" */}
                {activePage === 'couriers' && <Couriers token={token}/>} {/* Tab 'Người giao hàng" */}
            </main>
        </div>
    );
}

export default AdminPanel;
