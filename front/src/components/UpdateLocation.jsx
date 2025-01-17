import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Spin, message, Input } from 'antd';
import Header from './Header'; 
import './styles/UpdateLocation.css'; 

function UpdateLocation() {
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [balance, setBalance] = useState(0);
    const [address, setAddress] = useState('');  
    const navigate = useNavigate();

    useEffect(() => {
        const checkAuth = async () => {
            if (!token) {
                setIsAuthenticated(false);
                navigate('/login');
                return;
            }

            try {
                const response = await fetch('http://127.0.0.1:8000/auth/me', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });

                if (response.ok) {
                    setIsAuthenticated(true);
                    fetchCategories();
                    fetchBalance();
                } else {
                    setIsAuthenticated(false);
                    navigate('/login');
                }
            } catch (error) {
                console.error('Lỗi khi kiểm tra xác thực:', error);
                setIsAuthenticated(false);
                navigate('/login');
            } finally {
                setLoading(false);
            }
        };

        checkAuth();
    }, [token, navigate]);

    const fetchCategories = async () => {
        try {
            const response = await fetch('http://127.0.0.1:8000/api/dish-categories', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (response.ok) {
                const data = await response.json();
                setCategories(data);
            } else {
                throw new Error('Không thể tải các danh mục');
            }
        } catch (error) {
            console.error(error);
            setError('Không thể tải các danh mục');
        }
    };

    const fetchBalance = async () => {
        try {
            const response = await fetch('http://127.0.0.1:8000/auth/user/balance', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (response.ok) {
                const data = await response.json();
                setBalance(data.balance);
            } else {
                setBalance(0);
            }
        } catch (error) {
            console.error('Lỗi khi nhận số dư:', error);
            setError('Không thể nhận số dư');
        }
    };

    const handleLogout = async () => {
        try {
            await fetch('http://127.0.0.1:8000/auth/jwt/logout', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            localStorage.removeItem('token');
            setToken(null);
            setIsAuthenticated(false);
            setBalance(0);
        } catch (error) {
            console.error('Lỗi khi thoát:', error);
        }
    };

    const handleUpdateLocation = async () => {
        if (!address) {
            message.error('Vui lòng nhập địa chỉ');
            return;
        }

        try {
            const response = await fetch(`http://127.0.0.1:8000/api/customer/update_location?address=${encodeURIComponent(address)}`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                const data = await response.json();
                message.success(`Vị trí đã được cập nhật: ${data.location}`);
            } else {
                message.error('Không thể cập nhật vị trí');
            }
        } catch (error) {
            console.error('Lỗi khi cập nhật vị trí', error);
            message.error('Lỗi khi cập nhật vị trí');
        }
    };

    if (loading) {
        return (
            <div className="loading-container">
                <Spin size="large" />
            </div>
        );
    }

    return (
        <div className="update-location-container">
            <Header
                isAuthenticated={isAuthenticated}
                balance={balance}
                categories={categories}
                selectedCategory={selectedCategory}
                onCategoryChange={setSelectedCategory}
                handleLogout={handleLogout}
            />
            {isAuthenticated ? (
                <div className="content">
                    <h2>Cập nhật địa chỉ của bạn</h2>
                    <Input
                        placeholder="Nhập địa chỉ của bạn"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        style={{ marginBottom: 20 }}
                    />
                    <Button type="primary" onClick={handleUpdateLocation}>
                    Lưu
                    </Button>
                </div>
            ) : (
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Đăng nhập để tiếp tục</h2>
                    <Button type="primary" onClick={() => navigate('/login')}>
                    Chuyển đến trang đăng nhập
                    </Button>
                </div>
            )}
        </div>
    );
}

export default UpdateLocation;
