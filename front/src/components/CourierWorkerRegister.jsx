import { useState } from 'react';
import './styles/RegisterAdmin.css'; 

function CourierWorkerRegister() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [role, setRole] = useState('2'); 
    const [error, setError] = useState('');

    const handleRegister = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setError("Mật khẩu không khớp");
            return;
        }

        try {
            const response = await fetch('http://localhost:8000/courier_worker/register/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: email,
                    username: email.split('@')[0], // Tạo tên người dùng từ email
                    password: password,
                    is_active: true,
                    is_superuser: false,
                    is_verified: false,
                    role_id: parseInt(role), 
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || 'Đăng ký không thành công');
            }


            window.location.href = '/login';
        } catch (error) {
            console.error(error);
            setError(error.message || 'Đăng ký không thành công, vui lòng thử lại');
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <h2 className="auth-title">Đăng ký người giao hàng hoặc nhân viên bếp</h2>
                {error && <p className="text-red-500 text-center mb-4">{error}</p>}
                <form className="auth-form" onSubmit={handleRegister}>
                    <label htmlFor="email">Email</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <label htmlFor="password">Mật khẩu</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <label htmlFor="confirmPassword">Xác nhận mật khẩu</label>
                    <input
                        type="password"
                        id="confirmPassword"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                    />
                    <label htmlFor="role">Vai trò</label>
                    <select
                        id="role"
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        required
                    >
                        <option value="2">Người giao hàng</option>
                        <option value="3">Nhân viên bếp</option>
                    </select>
                    <button type="submit">Đăng ký</button>
                </form>
            </div>
        </div>
    );
}

export default CourierWorkerRegister;
