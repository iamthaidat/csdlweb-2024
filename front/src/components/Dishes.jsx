import React, { useState, useEffect } from 'react';
import './styles/Dishes.css';
import { Modal, Button, Input, Form, InputNumber } from 'antd';

function Dishes({ token }) {
    const [dishes, setDishes] = useState([]);
    const [newDish, setNewDish] = useState({
        name: '',
        price: '',
        weight: '',
        category_id: '',
        profit: '',
        time_of_preparing: '',
        image: null,
        restaurant_id: 1
    });
    const [error, setError] = useState('');
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [currentDish, setCurrentDish] = useState(null);
    const [form] = Form.useForm();


    useEffect(() => {
        fetchDishes();
    }, []);

    const fetchDishes = async () => {
        try {
            const response = await fetch('http://127.0.0.1:8000/admins/dishes', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (response.ok) {
                const data = await response.json();
                setDishes(data);
            } else {
                setError('Không thể tải món ăn');
            }
        } catch (error) {
            console.error('Lỗi khi tải món ăn:', error);
            setError('Lỗi khi tải món ăn');
        }
    };

    const handleAddDish = async () => {
      const formData = new FormData();
      formData.append('name', newDish.name);
      formData.append('price', newDish.price);
      formData.append('weight', newDish.weight);
      formData.append('category_id', newDish.category_id);
      formData.append('profit', newDish.profit);
      formData.append('time_of_preparing', newDish.time_of_preparing);
      if (newDish.image) {
          formData.append('image', newDish.image);
      }
      formData.append('restaurant_id', newDish.restaurant_id);
  
      try {
          const response = await fetch('http://127.0.0.1:8000/admins/dishes', {
              method: 'POST',
              headers: {
                  'Authorization': `Bearer ${token}`,
              },
              body: formData,
          });
          if (response.ok) {
            const data = await response.json();
            setDishes([...dishes, data]); // Cập nhật state dishes trực tiếp
            setNewDish({
              name: '',
              price: '',
              weight: '',
              category_id: '',
              profit: '',
              time_of_preparing: '',
              image: null,
              restaurant_id: 1
            });
          } else {
              setError('Không thể thêm món ăn');
          }
      } catch (error) {
        console.error('Lỗi khi thêm món ăn:', error);
        setError('Lỗi khi thêm món ăn');
      }
    };

    const handleDeleteDish = async (id) => {
        try {
            const response = await fetch(`http://127.0.0.1:8000/admins/dishes/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (response.ok) {
                setDishes(dishes.filter(dish => dish.id !== id));
            } else {
                setError('Không thể xóa món ăn');
            }
        } catch (error) {
            console.error('Lỗi khi xóa món ăn:', error);
            setError('Lỗi khi xóa món ăn');
        }
    };

    const handleUpdateDish = async (id, updatedData) => {
      const formData = new FormData();
      formData.append('name', updatedData.name);
      formData.append('price', updatedData.price);
      formData.append('weight', updatedData.weight);
      formData.append('category_id', updatedData.category_id);
      formData.append('profit', updatedData.profit);
      formData.append('time_of_preparing', updatedData.time_of_preparing);
      if (updatedData.image) {
          formData.append('image', updatedData.image);
      }

        try {
            const response = await fetch(`http://127.0.0.1:8000/admins/dishes/${id}`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
                body: formData,
            });

            if (response.ok) {
              fetchDishes()
                setIsModalVisible(false);
                setCurrentDish(null);
              form.resetFields();
            } else {
                setError('Không thể cập nhật món ăn');
            }
        } catch (error) {
            console.error('Lỗi khi cập nhật món ăn:', error);
            setError('Lỗi khi cập nhật món ăn');
        }
    };


  const showModal = (dish) => {
      setCurrentDish(dish);
      form.setFieldsValue(dish);
      setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setCurrentDish(null);
    form.resetFields();
  };

  const onFinish = (values) => {
    handleUpdateDish(currentDish.id, { ...values, image: values.image ? values.image[0].originFileObj : null});
  };

    return (
        <div className="main-content">
            <h1 className="page-title">Món ăn</h1>
            <h2 className="page-title">Thêm món ăn mới</h2>
            <div className="input-group">
                <input
                    className="input"
                    type="text"
                    placeholder="Tên"
                    value={newDish.name}
                    onChange={e => setNewDish({ ...newDish, name: e.target.value })}
                />
                <input
                    className="input"
                    type="number"
                    placeholder="Giá"
                    value={newDish.price}
                    onChange={e => setNewDish({ ...newDish, price: e.target.value })}
                />
                <input
                    className="input"
                    type="number"
                    placeholder="Cân nặng"
                    value={newDish.weight}
                    onChange={e => setNewDish({ ...newDish, weight: e.target.value })}
                />
                <input
                    className="input"
                    type="number"
                    placeholder="Danh mục ID"
                    value={newDish.category_id}
                    onChange={e => setNewDish({ ...newDish, category_id: e.target.value })}
                />
                <input
                    className="input"
                    type="number"
                    placeholder="Lợi nhuận"
                    value={newDish.profit}
                    onChange={e => setNewDish({ ...newDish, profit: e.target.value })}
                />
                <input
                    className="input"
                    type="number"
                    placeholder="Thời gian chế biến"
                    value={newDish.time_of_preparing}
                    onChange={e => setNewDish({ ...newDish, time_of_preparing: e.target.value })}
                />
                <input
                    className="input"
                    type="file"
                    onChange={e => setNewDish({ ...newDish, image: e.target.files[0] })}
                />
                <button className="btn" onClick={handleAddDish}>Thêm món ăn</button>
            </div>
            {error && <p className="error">{error}</p>}
            <div className="table-container">
                <table className="dishes-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Tên</th>
                            <th>Giá</th>
                            <th>Cân nặng</th>
                            <th>Danh mục</th>
                            <th>Lợi nhuận</th>
                            <th>Thời gian chế biến</th>
                            <th>Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {dishes.map(dish => (
                            <tr key={dish.id}>
                                <td>{dish.id}</td>
                                <td>{dish.name}</td>
                                <td>{dish.price}</td>
                                <td>{dish.weight}</td>
                                <td>{dish.category_id}</td>
                                <td>{dish.profit}</td>
                                <td>{dish.time_of_preparing}</td>
                                <td>
                                  <button className="btn" onClick={() => showModal(dish)}>Cập nhật</button>
                                    <button className="btn" onClick={() => handleDeleteDish(dish.id)}>Xóa</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

          <Modal
            title="Cập nhật món ăn"
            visible={isModalVisible}
            onCancel={handleCancel}
            footer={null}
          >
             <Form
                form={form}
                onFinish={onFinish}
                layout="vertical"
                >
                <Form.Item
                  label="Tên món ăn"
                  name="name"
                  rules={[{ required: true, message: 'Vui lòng nhập tên món ăn!' }]}
                >
                  <Input />
                </Form.Item>

                <Form.Item
                  label="Giá"
                  name="price"
                  rules={[{ required: true, message: 'Vui lòng nhập giá!' }]}
                >
                  <InputNumber style={{ width: '100%' }}/>
                </Form.Item>

                <Form.Item
                  label="Cân nặng"
                  name="weight"
                  rules={[{ required: true, message: 'Vui lòng nhập cân nặng!' }]}
                >
                  <InputNumber style={{ width: '100%' }}/>
                </Form.Item>

                <Form.Item
                  label="Danh mục ID"
                  name="category_id"
                  rules={[{ required: true, message: 'Vui lòng nhập danh mục ID!' }]}
                >
                    <InputNumber style={{ width: '100%' }}/>
                </Form.Item>

                <Form.Item
                  label="Lợi nhuận"
                  name="profit"
                  rules={[{ required: true, message: 'Vui lòng nhập lợi nhuận!' }]}
                >
                   <InputNumber style={{ width: '100%' }}/>
                </Form.Item>

               <Form.Item
                  label="Thời gian chế biến"
                  name="time_of_preparing"
                   rules={[{ required: true, message: 'Vui lòng nhập thời gian chế biến!' }]}
                >
                  <InputNumber style={{ width: '100%' }}/>
               </Form.Item>


               <Form.Item
                 label="Ảnh"
                 name="image"
               >
                 <Input type="file" />
              </Form.Item>

                <Form.Item>
                  <Button type="primary" htmlType="submit">
                    Cập nhật
                  </Button>
                </Form.Item>
              </Form>
          </Modal>
        </div>
    );
}

export default Dishes;