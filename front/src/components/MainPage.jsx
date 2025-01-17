import {useState, useEffect} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import {Button, Select, Spin, message} from 'antd';
import {LogoutOutlined, ShoppingCartOutlined, PlusCircleOutlined} from '@ant-design/icons';
import Header from './Header';
import './styles/MainPage.css';

function MainPage() {
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [role, setRole] = useState(localStorage.getItem('role'));
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [error, setError] = useState('');
    const [dishes, setDishes] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [loading, setLoading] = useState(true);
    const [cart, setCart] = useState([]);
    const [customerId, setCustomerId] = useState(null);
    const [balance, setBalance] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        const checkAuth = async () => {
            if (!token) {
                setIsAuthenticated(false);
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
                    const userData = await response.json();
                    setIsAuthenticated(true);
                    const roleResponse = await fetch('http://127.0.0.1:8000/auth/my_role', {
                        method: 'GET',
                        headers: {
                            'Authorization': `Bearer ${token}`,
                        },
                    });

                    if (roleResponse.ok) {
                        const roleData = await roleResponse.json();
                        setRole(roleData.role);
                        localStorage.setItem('role', roleData.role);
                    }
                    fetchBalance();
                } else {
                    setIsAuthenticated(false);
                }
            } catch (error) {
                console.error('Lỗi khi kiểm tra xác thực:', error);
                setIsAuthenticated(false);
            }
        };

        checkAuth();
    }, [token]);

    useEffect(() => {
        fetchDishes();
        fetchCategories();
    }, [selectedCategory]);

    const fetchCategories = async () => {
        try {
            const response = await fetch('http://127.0.0.1:8000/api/dish-categories', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (!response.ok) throw new Error('Không thể tải các danh mục');
            const data = await response.json();
            setCategories(data);
        } catch (error) {
            console.error(error);
            setError('Không thể tải các danh mục, vui lòng thử lại');
        }
    };

    const fetchDishes = async () => {
        setLoading(true);
        setError('');
        try {
            const url = selectedCategory
                ? `http://127.0.0.1:8000/api/dishes/category/${selectedCategory}`
                : 'http://127.0.0.1:8000/api/dishes';

            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (!response.ok) throw new Error('Không thể tải món ăn');
            const data = await response.json();
            setDishes(data);
        } catch (error) {
            console.error(error);
            setError('Không thể tải món ăn, vui lòng thử lại');
        } finally {
            setLoading(false);
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
            setDishes([]);
            setCart([]);
            setBalance(0);
        } catch (error) {
            console.error('Lỗi khi thoát:', error);
        }
    };

    const handleCategoryChange = (value) => {
        setSelectedCategory(value);
    };

    const addToCart = async (dish) => {
        try {
            const response = await fetch('http://127.0.0.1:8000/api/cart/add-dish', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                    dish_id: dish.id,
                    quantity: 1,
                }),
            });

            if (!response.ok) throw new Error('Không thể thêm món ăn vào giỏ hàng');
            const updatedCart = await response.json();
            setCart(updatedCart.dishes);
            message.success(`${dish.name} Đã thêm vào giỏ hàng!`);
        } catch (error) {
            console.error('Lỗi khi thêm món ăn vào giỏ hàng:', error);
            setError(`Không thể thêm món ăn vào giỏ hàng: ${error.message}`);
        }
    };

    return (
        <div className="main-container">
            <Header
                isAuthenticated={isAuthenticated}
                balance={balance}
                categories={categories}
                selectedCategory={selectedCategory}
                onCategoryChange={setSelectedCategory}
                handleLogout={handleLogout}
                role_id={role}
            />

            <main className="main-content">
                {isAuthenticated ? (
                    <>
                        <h2 className="title">Những món ăn ngon nhất của chúng tôi</h2>
                        <div className="dishes-grid">
                            {loading ? (
                                <div className="col-span-full flex justify-center">
                                    <Spin size="large"/>
                                </div>
                            ) : error ? (
                                <p className="col-span-full text-red-500 text-center">{error}</p>
                            ) : (
                                dishes.length > 0 ? (
                                    dishes.map(dish => (
                                        <div key={dish.id} className="dish-card">
                                        <img
                                            src={dish.image_path?.startsWith("http")
                                                ? dish.image_path
                                                : `http://127.0.0.1:8000/${dish.image_path || 'default-dish.jpg'}`}
                                            alt={dish.name}
                                            className="dish-image"
                                        />
                                            <h3 className="dish-title">{dish.name}</h3>
                                            <p>{dish.description}</p>
                                            <p className="dish-price">{dish.price} VND</p>
                                            <Button
                                                type="primary"
                                                icon={<ShoppingCartOutlined/>}
                                                className="mt-4 w-full bg-green-500"
                                                onClick={() => addToCart(dish)}
                                            >
                                                Vào giỏ hàng
                                            </Button>
                                        </div>
                                    ))
                                ) : (
                                    <p className="col-span-full text-center text-gray-500">Không có món ăn nào có sẵn.</p>
                                )
                            )}
                        </div>
                    </>
                ) : (
                    <div className="auth-container">
                        <div className="auth-card">
                            <h1 className="auth-title">Chào mừng bạn!</h1>
                            <p>Chọn hành động để bắt đầu làm việc với hệ thống của chúng tôi.</p>
                            <div className="auth-buttons">
                                <Link to="/login">
                                    <button>Đăng nhập</button>
                                </Link>
                                <Link to="/register">
                                    <button className="secondary">Đăng ký</button>
                                </Link>
                                <Link to="/register/courier_or_worker">
                                    <button>Đăng ký người giao hàng/nhân viên bếp</button>
                                </Link>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}

export default MainPage;