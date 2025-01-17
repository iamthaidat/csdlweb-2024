import React, { useState } from 'react';
import './styles/Register.css';  
function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Mật khẩu của bạn phải trùng với xác nhận");
      return;
    }

    try {
      const response = await fetch('http://127.0.0.1:8000/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          username: email.split('@')[0],
          password: password,
          is_active: true,
          is_superuser: false,
          is_verified: false,
          role_id: 1,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Registration failed');
      }

      window.location.href = '/login';
    } catch (error) {
      console.error(error);
      setError(error.message || 'Registration failed, please try again');
    }
  };

  return (
    <div className="register-container">
      <div className="register-card">
        <h2 className="register-title">Đăng ký thành viên khách hàng</h2>
        {error && <p className="error-message">{error}</p>}
        <form onSubmit={handleRegister}>
          <div className="form-group">
            <label htmlFor="email" className="register-label">
              Email
            </label>
            <input
              type="email"
              id="email"
              className="register-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password" className="register-label">
              Mật Khẩu
            </label>
            <input
              type="password"
              id="password"
              className="register-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="confirmPassword" className="register-label">
              Nhắc lại mật khẩu
            </label>
            <input
              type="password"
              id="confirmPassword"
              className="register-input"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="register-button">
            Đăng ký
          </button>
        </form>
      </div>
    </div>
  );
}

export default Register;
