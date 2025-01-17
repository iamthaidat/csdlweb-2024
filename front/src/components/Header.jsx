import { Link, useNavigate } from 'react-router-dom';
 import { Button, Select } from 'antd';
 import {
     LogoutOutlined,
     ShoppingCartOutlined,
     PlusCircleOutlined,
     FileDoneOutlined,
     DashboardOutlined,
     AppstoreAddOutlined,
     EnvironmentOutlined
 } from '@ant-design/icons';
 import PropTypes from 'prop-types';
 import './styles/header.css';
 import logo from './images/logo.png';
 import {useState, useEffect} from "react";
 
 const Header = ({
                     isAuthenticated,
                     balance,
                     categories,
                     selectedCategory,
                     onCategoryChange,
                     handleLogout,
                     role_id
                 }) => {
     const navigate = useNavigate();
     const [isAnimated, setIsAnimated] = useState(true);


     useEffect(() => {
         let animationTimeout;
         if (isAnimated) {
              animationTimeout = setTimeout(() => {
                  setIsAnimated(false);
                setTimeout(() => setIsAnimated(true),)
             }, 9600); // Dừng animation sau 9s + 3s
         }
         return () => clearTimeout(animationTimeout);
     }, [isAnimated]);
 
     return (
         <header className="header">
             <div className="logo-and-balance">
                 <Link to="/" className="logo">
                     <img src={logo} alt="Logo" />
                      {isAnimated &&  <img  className="animated-logo" src={logo} alt="Logo" /> }
                     <span>FoodExpress</span>
                 </Link>
                 {isAuthenticated && role_id === 1 && (
                     <div className="balance-section">
                         <span className="balance">Số dư: {balance} VND</span>
                         <Link to="/add_balance">
                             <Button icon={<PlusCircleOutlined/>} className="button-recharge">
                             Nạp
                             </Button>
                         </Link>
                     </div>
                 )}
             </div>
 
             <div className="navigation-section">
                 {/* Dành cho vai trò khách hàng */}
                 {isAuthenticated && role_id === 1 && (
                     <>
                         <Select
                             placeholder="Chọn danh mục"
                             value={selectedCategory}
                             onChange={onCategoryChange}
                             className="nav-select"
                         >
                             <Select.Option value="">Tất cả</Select.Option>
                             {categories.map(c => (
                                 <Select.Option key={c.name} value={c.name}>
                                     {c.name}
                                 </Select.Option>
                             ))}
                         </Select>
                         <Button
                             type="text"
                             icon={<ShoppingCartOutlined/>}
                             className="button-cart"
                             onClick={() => navigate('/create_order')}
                         >
                             Giỏ hàng
                         </Button>
                         <Link to="/customer/location">
                             <Button type="text" icon={<EnvironmentOutlined/>} className="button-location">
                             Cập nhật vị trí
                             </Button>
                         </Link>
                     </>
                 )}
 
                 {/* Dành cho người giao hàng */}
                 {isAuthenticated && role_id === 2 && (
                     <>
                         <Link to="/courier/take_order">
                             <Button type="text" icon={<FileDoneOutlined/>} className="button-location">
                             Quản lý đơn hàng
                             </Button>
                         </Link>
                     </>
                 )}
 
                 {/* Dành cho nhân viên bếp */}
                 {isAuthenticated && role_id === 3 && (
                     <>
                         <Link to="/kitchen_orders">
                             <Button type="text" icon={<FileDoneOutlined/>} className="button-location">
                             Quản lý đơn hàng
                             </Button>
                         </Link>
                     </>
                 )}
 
                 {/* Dành cho quản trị viên */}
                 {isAuthenticated && role_id === 4 && (
                     <>
                         <Link to="/admin/register">
                             <Button type="text" icon={<AppstoreAddOutlined/>} className="button-location">
                             Đăng ký quản trị viên
                             </Button>
                         </Link>
                         <Link to="/admin">
                             <Button type="text" icon={<DashboardOutlined/>} className="button-location">
                             Bảng điều khiển quản trị viên
                             </Button>
                         </Link>
                         {/* <Link to="http://localhost:8080/reports" target="_blank">
                             <Button type="text" icon={<FileDoneOutlined/>} className="button-location">
                             Báo cáo
                             </Button>
                         </Link> */}
                     </>
                 )}
 
                 {/* Thoát */}
                 {isAuthenticated && (
                     <Link to="/" target="_blank">
 
                         <Button type="text" icon={<LogoutOutlined/>} className="button-logout" onClick={handleLogout}>
                         Thoát
                         </Button>
                     </Link>
                         )}
                     </div>
                     </header>
                     );
                 };
 
                 Header.propTypes = {
                 isAuthenticated: PropTypes.bool,
                 balance: PropTypes.number,
                 categories: PropTypes.array,
                 selectedCategory: PropTypes.string,
                 onCategoryChange: PropTypes.func,
                 handleLogout: PropTypes.func,
                 role_id: PropTypes.number,
             };
 
                 export default Header;