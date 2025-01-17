import React, { useEffect, useState } from 'react';
import { Button, Card, InputNumber, message, Spin } from 'antd';
import { useNavigate } from 'react-router-dom';
import Header from './Header';

function OrderPage() {
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [cart, setCart] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);
    const [status, setStatus] = useState({ loading: false, error: '' });
    const navigate = useNavigate();
    const [balance, setBalance] = useState(0);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('');

    useEffect(() => {
        checkAuth();
        fetchCategories();
    }, []);

    const checkAuth = async () => {
        const storedToken = localStorage.getItem('token');
        if (storedToken) {
            setToken(storedToken);
            fetchCart(storedToken);
            fetchBalance(storedToken);
        } else {
            setStatus({ ...status, error: 'Token not found' });
        }
    };

    const fetchCategories = async () => {
        try {
            const response = await fetch('http://127.0.0.1:8000/api/categories', {
                method: 'GET',
                headers: { 'Authorization': `Bearer ${token}` },
            });
            if (response.ok) {
                const data = await response.json();
                setCategories(data.categories);
            }
        } catch (error) {
            console.error('Lỗi khi tải các danh mục:', error);
        }
    };

    const fetchDishDetails = async (dish_id) => {
        const response = await fetch(`http://127.0.0.1:8000/api/dishes/${dish_id}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
        });
        if (!response.ok) {
            throw new Error('Failed to fetch dish details');
        }
        return response.json();
    };

    const fetchCart = async (token) => {
        setStatus({ ...status, loading: true, error: '' });
        try {
            const response = await fetch('http://127.0.0.1:8000/api/cart', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (!response.ok) throw new Error('Failed to fetch cart');
            const data = await response.json();
            const updatedCart = await Promise.all(
                data.dishes.map(async (item) => {
                    const dishDetails = await fetchDishDetails(item.dish_id);
                    return {
                        ...item,
                        dish_name: dishDetails.name,
                        price: dishDetails.price,
                    };
                })
            );
            setCart(updatedCart);
            calculateTotal(updatedCart);
        } catch (error) {
            setStatus({ ...status, error: 'Failed to fetch cart' });
            console.error(error);
        } finally {
            setStatus({ ...status, loading: false });
        }
    };

    const fetchBalance = async (token) => {
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
            setStatus({ ...status, error: 'Không thể nhận số dư' });
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
            setCart([]);
            setBalance(0);
        } catch (error) {
            console.error('Lỗi khi thoát:', error);
        }
    };

    const calculateTotal = (dishes) => {
        const total = dishes.reduce((sum, dish) => sum + dish.price * dish.quantity, 0);
        setTotalPrice(total);
    };

    const handleQuantityChange = async (dish_id, quantity) => {
        try {
            const response = await fetch('http://127.0.0.1:8000/api/cart/update-quantity', {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ dish_id, quantity }),
            });

            if (!response.ok) {
                throw new Error('Không thể cập nhật số lượng món ăn');
            }

            const updatedCart = cart
                .map(item => (item.dish_id === dish_id ? { ...item, quantity } : item))
                .filter(item => item.quantity > 0); // Loại bỏ món ăn có số lượng = 0
            setCart(updatedCart);
            calculateTotal(updatedCart);
        } catch (error) {
            console.error('Error updating quantity:', error);
            message.error('Lỗi khi cập nhật số lượng món ăn');
        }
    };

    const handleRemoveDish = async (dish_id) => {
        try {
            const response = await fetch(`http://127.0.0.1:8000/api/cart/remove-dish/${dish_id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error('Không thể xóa món ăn khỏi giỏ hàng');
            }

            const updatedCart = cart.filter(item => item.dish_id !== dish_id);
            setCart(updatedCart);
            calculateTotal(updatedCart);
            message.success('Đã xóa món ăn khỏi giỏ hàng');
        } catch (error) {
            console.error('Error removing dish:', error);
            message.error('Lỗi khi xóa món ăn khỏi giỏ hàng');
        }
    };

    const handleCreateOrder = async () => {
        setStatus({ ...status, loading: true, error: '' });
        try {
            const response = await fetch('http://127.0.0.1:8000/api/cart/create-order', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ dishes: cart }),
            });

            if (response.ok) {
                navigate(`/`);
            } else {
                throw new Error('Failed to create order');
            }
        } catch (error) {
            setStatus({ ...status, error: 'Số dư của quý khách không đủ vui lòng nạp thêm' });
            console.error(error);
        } finally {
            setStatus({ ...status, loading: false });
        }
    };

    return (
        <div style={{ padding: '20px' }}>
            <Header
                isAuthenticated={!!token}
                balance={balance}
                categories={categories}
                selectedCategory={selectedCategory}
                onCategoryChange={(value) => setSelectedCategory(value)}
                handleLogout={handleLogout}
            />

            <div style={{ position: 'relative', padding: '20px', marginTop: '80px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h1 style={{ fontSize: '24px' }}>Đơn hàng của bạn</h1>
                    <div style={{
                        backgroundColor: '#f5f5f5',
                        padding: '10px',
                        borderRadius: '5px',
                        fontSize: '16px',
                        fontWeight: 'bold',
                        position: 'absolute',
                        top: '20px',
                        right: '20px'
                    }}>
                        <p style={{ margin: 0 }}>Tổng chi phí: {totalPrice} VND</p>
                    </div>
                </div>

                {status.loading ? (
                    <div style={{ textAlign: 'center' }}>
                        <Spin size="large" />
                        <p>Đang tải...</p>
                    </div>
                ) : (
                    <div>
                        {cart.length === 0 ? (
                            <p style={{ textAlign: 'center', color: '#888' }}>Đơn hàng của bạn trống</p>
                        ) : (
                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                                gap: '16px',
                                maxHeight: '400px',
                                overflowY: 'auto'
                            }}>
                                {cart.map((item) => (
                                    <Card key={item.dish_id} style={{ marginBottom: '16px' }}>
                                        <p style={{ fontWeight: 'bold' }}>{item.dish_name}</p>
                                        <p>Giá mỗi món: {item.price} VND</p>
                                        <p>Số tiền: {item.quantity * item.price} VND</p>
                                        <InputNumber
                                            min={0}
                                            value={item.quantity}
                                            onChange={(value) => handleQuantityChange(item.dish_id, value)}
                                            style={{ width: '100%' }}
                                        />
                                        <Button
                                            type="danger"
                                            onClick={() => handleRemoveDish(item.dish_id)}
                                            style={{ marginTop: '10px', width: '100%' }}
                                        >
                                            Xóa
                                        </Button>
                                    </Card>
                                ))}
                            </div>
                        )}
                        <div style={{ textAlign: 'center', marginTop: '20px' }}>
                            <Button
                                type="primary"
                                onClick={handleCreateOrder}
                                disabled={cart.length === 0 || status.loading}
                            >
                                Đặt hàng
                            </Button>
                        </div>
                    </div>
                )}
                {status.error && <p style={{ textAlign: 'center', color: 'red' }}>{status.error}</p>}
            </div>
        </div>
    );
}

export default OrderPage;
