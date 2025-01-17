import React, { useState, useEffect } from 'react';
import './styles/AdminPanel.css';

function DishCategories({ token }) {
    const [categories, setCategories] = useState([]);
    const [newCategory, setNewCategory] = useState('');
    const [editingCategoryId, setEditingCategoryId] = useState(null);
    const [editedCategoryName, setEditedCategoryName] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const response = await fetch('http://127.0.0.1:8000/api/dish-categories', {
                headers: { 'Authorization': `Bearer ${token}` },
            });

            if (response.ok) {
                const data = await response.json();
                setCategories(data);
            } else {
                setError('Không thể tải các danh mục món ăn');
            }
        } catch (err) {
            console.error('Error fetching categories:', err);
            setError('Lỗi khi tải các danh mục');
        }
    };

    const handleAddCategory = async () => {
        try {
            const response = await fetch(`http://127.0.0.1:8000/admins/dish-categories?name=${encodeURIComponent(newCategory)}`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` },
            });

            if (response.ok) {
                fetchCategories();
                setNewCategory('');
            } else {
                setError('Không thể thêm danh mục');
            }
        } catch (err) {
            console.error('Error adding category:', err);
            setError('Lỗi khi thêm danh mục');
        }
    };

    const handleDeleteCategory = async (name) => {
        try {
            const response = await fetch(`http://127.0.0.1:8000/admins/dish-categories?name=${encodeURIComponent(name)}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` },
            });

            if (response.ok) {
                fetchCategories();
            } else {
                setError('Không thể xóa danh mục');
            }
        } catch (err) {
            console.error('Error deleting category:', err);
            setError('Lỗi khi xóa danh mục');
        }
    };

    const handleUpdateCategory = async () => {
        if (!editedCategoryName.trim()) {
            setError('Tên danh mục không được để trống');
            return;
        }
    
        // Tìm danh mục đang chỉnh sửa, chuyển về chữ thường để so sánh
        const categoryToEdit = categories.find(
            category => category.id === editingCategoryId
        );
    
        if (!categoryToEdit) {
            setError('Không tìm thấy danh mục để chỉnh sửa');
            return;
        }
    
        try {
            const response = await fetch(
                `http://127.0.0.1:8000/admins/dish-categories?old_name=${encodeURIComponent(
                    categoryToEdit.name.toLowerCase() // Chuyển về chữ thường
                )}&new_name=${encodeURIComponent(editedCategoryName.trim())}`,
                {
                    method: 'PATCH',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'accept': 'application/json',
                    },
                }
            );
    
            if (response.ok) {
                setEditingCategoryId(null);
                setEditedCategoryName('');
                fetchCategories();
                setSuccess('Đã cập nhật danh mục thành công');
            } else {
                setError('Không thể thay đổi danh mục');
            }
        } catch (err) {
            console.error('Error updating category:', err);
            setError('Lỗi khi thay đổi danh mục');
        }
    };
    

    return (
        <div>
            <h1>Danh mục món ăn</h1>
            <div className="input-group">
                <input
                    type="text"
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    placeholder="Tên danh mục mới"
                />
                <button onClick={handleAddCategory}>Thêm danh mục</button>
            </div>
            {error && <p className="error">{error}</p>}

            <table className="categories-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Tên</th>
                        <th>Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    {categories.map(category => (
                        <tr key={category.id}>
                            <td>{category.id}</td>
                            <td>
                                {editingCategoryId === category.id ? (
                                    <input
                                        type="text"
                                        value={editedCategoryName}
                                        onChange={(e) => setEditedCategoryName(e.target.value)}
                                    />
                                ) : (
                                    category.name
                                )}
                            </td>
                            <td>
                                {editingCategoryId === category.id ? (
                                    <>
                                        <button onClick={handleUpdateCategory}>Lưu</button>
                                        <button onClick={() => setEditingCategoryId(null)}>Hủy</button>
                                    </>
                                ) : (
                                    <>
                                        <button onClick={() => {
                                            setEditingCategoryId(category.id);
                                            setEditedCategoryName(category.name);
                                        }}>Chỉnh sửa</button>
                                        <button onClick={() => handleDeleteCategory(category.name)}>Xóa</button>
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

export default DishCategories;
