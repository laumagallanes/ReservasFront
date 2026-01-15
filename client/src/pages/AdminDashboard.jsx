import React, { useState, useEffect } from 'react';
import { getCategories, getProducts, addCategory, updateCategory, deleteCategory, addProduct, updateProduct, deleteProduct, logout } from '../services/api';
import { useNavigate } from 'react-router-dom';
import { Plus, Trash, Logout, Edit, X, Check } from 'tabler-icons-react';

const AdminDashboard = () => {
    const [categories, setCategories] = useState([]);
    const [products, setProducts] = useState([]);
    const [newCategory, setNewCategory] = useState({ name: '', display_order: 0 });
    const [newProduct, setNewProduct] = useState({ category_id: '', name: '', description: '', image_url: '' });

    // Using ID-based tracking for more robust comparison
    const [editingProduct, setEditingProduct] = useState(null); // stores the product object
    const [editingCategory, setEditingCategory] = useState(null); // stores the category object

    const navigate = useNavigate();

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [cats, prods] = await Promise.all([getCategories(), getProducts()]);
            setCategories(cats || []);
            setProducts(prods || []);
        } catch (err) {
            console.error("Fetch Data Error:", err);
            if (err.response?.status === 401 || err.response?.status === 403) {
                handleLogout();
            }
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const handleAuthError = (err, action) => {
        if (err.response?.status === 401 || err.response?.status === 403) {
            alert(`Sessión expirada o inválida. Por favor, vuelva a iniciar sesión.`);
            handleLogout();
        } else {
            alert(`Error ${action}: ${err.response?.data?.error || err.message}`);
        }
    };

    const handleAddCategory = async (e) => {
        e.preventDefault();
        try {
            await addCategory(newCategory);
            setNewCategory({ name: '', display_order: 0 });
            await fetchData();
        } catch (err) {
            handleAuthError(err, 'adding category');
        }
    };

    const handleUpdateCategory = async (e) => {
        e.preventDefault();
        try {
            await updateCategory(editingCategory.id, editingCategory);
            setEditingCategory(null);
            await fetchData();
        } catch (err) {
            handleAuthError(err, 'updating category');
        }
    };

    const handleDeleteCategory = async (id) => {
        if (window.confirm('Delete this category? Products in this category will become uncategorized.')) {
            try {
                await deleteCategory(id);
                await fetchData();
            } catch (err) {
                handleAuthError(err, 'deleting category');
            }
        }
    };

    const handleAddProduct = async (e) => {
        e.preventDefault();
        try {
            await addProduct({ ...newProduct, price: 0 });
            setNewProduct({ category_id: '', name: '', description: '', image_url: '' });
            await fetchData();
        } catch (err) {
            handleAuthError(err, 'adding product');
        }
    };

    const handleUpdateProduct = async (e) => {
        e.preventDefault();
        try {
            await updateProduct(editingProduct.id, { ...editingProduct, price: 0 });
            setEditingProduct(null);
            await fetchData();
        } catch (err) {
            handleAuthError(err, 'updating product');
        }
    };

    const handleDeleteProduct = async (id) => {
        if (window.confirm('Delete this product?')) {
            try {
                await deleteProduct(id);
                await fetchData();
            } catch (err) {
                handleAuthError(err, 'deleting product');
            }
        }
    };

    return (
        <div className="min-h-screen bg-malaga-50 p-4 md:p-8 selection:bg-malaga-200">
            <div className="max-w-6xl mx-auto">
                <div className="flex justify-between items-center mb-12">
                    <div>
                        <h1 className="text-4xl font-serif font-bold text-malaga-900">Admin Dashboard</h1>
                        <p className="text-malaga-600 italic">Manage your menu and categories</p>
                    </div>
                    <button
                        type="button"
                        onClick={handleLogout}
                        className="flex items-center gap-2 px-6 py-3 bg-white text-malaga-700 rounded-xl shadow-md border border-malaga-200 hover:bg-red-50 hover:text-red-600 transition-all font-bold uppercase tracking-widest text-xs"
                    >
                        <Logout size={18} />
                        Logout
                    </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Categories Manager */}
                    <div className="glass-panel p-8 rounded-3xl bg-white/80 border border-malaga-100 shadow-xl overflow-hidden">
                        <h2 className="text-2xl font-serif font-bold mb-6 flex items-center gap-3">
                            <span className="w-8 h-8 bg-malaga-200 rounded-lg flex items-center justify-center text-malaga-800 text-sm">1</span>
                            Categories
                        </h2>
                        <form onSubmit={handleAddCategory} className="flex flex-col gap-4 mb-8">
                            <div className="flex gap-4">
                                <input
                                    placeholder="Category Name"
                                    value={newCategory.name}
                                    onChange={e => setNewCategory({ ...newCategory, name: e.target.value })}
                                    className="flex-1 px-4 py-3 bg-malaga-50 border border-malaga-200 rounded-xl outline-none focus:ring-2 focus:ring-malaga-300"
                                    required
                                />
                                <input
                                    type="number"
                                    placeholder="Order"
                                    value={newCategory.display_order}
                                    onChange={e => setNewCategory({ ...newCategory, display_order: parseInt(e.target.value) || 0 })}
                                    className="w-24 px-4 py-3 bg-malaga-50 border border-malaga-200 rounded-xl outline-none focus:ring-2 focus:ring-malaga-300"
                                    required
                                />
                                <button type="submit" className="px-5 py-3 bg-malaga-900 text-white rounded-xl hover:bg-malaga-800 transition-all shadow-md">
                                    <Plus size={20} />
                                </button>
                            </div>
                        </form>
                        <div className="space-y-3">
                            {categories.map(cat => (
                                <div key={cat.id} className="p-4 bg-white border border-malaga-100 rounded-xl shadow-sm transition-all">
                                    {editingCategory?.id === cat.id ? (
                                        <form onSubmit={handleUpdateCategory} className="flex gap-2">
                                            <input
                                                value={editingCategory.name}
                                                onChange={e => setEditingCategory({ ...editingCategory, name: e.target.value })}
                                                className="flex-1 p-2 border border-malaga-300 rounded-lg text-sm bg-malaga-50"
                                                autoFocus
                                            />
                                            <input
                                                type="number"
                                                value={editingCategory.display_order}
                                                onChange={e => setEditingCategory({ ...editingCategory, display_order: parseInt(e.target.value) || 0 })}
                                                className="w-20 p-2 border border-malaga-300 rounded-lg text-sm bg-malaga-50"
                                            />
                                            <button type="submit" className="p-2 bg-green-600 text-white rounded-lg hover:bg-green-700"><Check size={18} /></button>
                                            <button type="button" onClick={() => setEditingCategory(null)} className="p-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500"><X size={18} /></button>
                                        </form>
                                    ) : (
                                        <div className="flex justify-between items-center group">
                                            <div>
                                                <span className="font-bold text-malaga-900">{cat.name}</span>
                                                <span className="ml-4 text-[10px] text-malaga-400 font-mono tracking-tighter uppercase font-bold border border-malaga-100 px-2 py-0.5 rounded">Order: {cat.display_order}</span>
                                            </div>
                                            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button
                                                    type="button"
                                                    onClick={() => setEditingCategory({ ...cat })}
                                                    className="p-1.5 text-malaga-600 hover:bg-malaga-100 rounded-lg transition-colors"
                                                    title="Edit Category"
                                                >
                                                    <Edit size={16} />
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => handleDeleteCategory(cat.id)}
                                                    className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                                    title="Delete Category"
                                                >
                                                    <Trash size={16} />
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Add Product Section */}
                    <div className="glass-panel p-8 rounded-3xl bg-white/80 border border-malaga-100 shadow-xl">
                        <h2 className="text-2xl font-serif font-bold mb-6 flex items-center gap-3">
                            <span className="w-8 h-8 bg-malaga-200 rounded-lg flex items-center justify-center text-malaga-800 text-sm">2</span>
                            Add Product
                        </h2>
                        <form onSubmit={handleAddProduct} className="space-y-4">
                            <select
                                value={newProduct.category_id}
                                onChange={e => setNewProduct({ ...newProduct, category_id: e.target.value })}
                                className="w-full px-4 py-3 bg-malaga-50 border border-malaga-200 rounded-xl outline-none focus:ring-2 focus:ring-malaga-300"
                                required
                            >
                                <option value="">Select Category</option>
                                {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                            </select>
                            <input
                                placeholder="Product Name"
                                value={newProduct.name}
                                onChange={e => setNewProduct({ ...newProduct, name: e.target.value })}
                                className="w-full px-4 py-3 bg-malaga-50 border border-malaga-200 rounded-xl outline-none focus:ring-2 focus:ring-malaga-300"
                                required
                            />
                            <textarea
                                placeholder="Product Description"
                                value={newProduct.description}
                                onChange={e => setNewProduct({ ...newProduct, description: e.target.value })}
                                className="w-full px-4 py-3 bg-malaga-50 border border-malaga-200 rounded-xl outline-none h-24 focus:ring-2 focus:ring-malaga-300"
                            />
                            <input
                                placeholder="Image URL"
                                value={newProduct.image_url}
                                onChange={e => setNewProduct({ ...newProduct, image_url: e.target.value })}
                                className="w-full px-4 py-3 bg-malaga-50 border border-malaga-200 rounded-xl outline-none focus:ring-2 focus:ring-malaga-300"
                            />
                            <button type="submit" className="w-full py-4 bg-malaga-900 text-white rounded-xl hover:bg-malaga-800 transition-all shadow-md font-bold uppercase tracking-widest text-xs">
                                Add Product to Menu
                            </button>
                        </form>
                    </div>
                </div>

                {/* Current Menu - Product Management */}
                <div className="mt-12">
                    <h2 className="text-3xl font-serif font-bold mb-8 text-malaga-900">Current Menu</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {products.map(product => (
                            <div key={product.id} className="bg-white p-6 rounded-[2rem] border border-malaga-100 shadow-sm hover:shadow-lg transition-all flex flex-col gap-4">
                                {editingProduct?.id === product.id ? (
                                    <form onSubmit={handleUpdateProduct} className="space-y-3 bg-malaga-50/50 p-2 rounded-xl">
                                        <label className="text-[10px] font-bold text-malaga-500 uppercase ml-1">Name</label>
                                        <input
                                            value={editingProduct.name}
                                            onChange={e => setEditingProduct({ ...editingProduct, name: e.target.value })}
                                            className="w-full p-2.5 border border-malaga-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-malaga-300"
                                            autoFocus
                                        />
                                        <label className="text-[10px] font-bold text-malaga-500 uppercase ml-1 block mt-2">Category</label>
                                        <select
                                            value={editingProduct.category_id || ''}
                                            onChange={e => setEditingProduct({ ...editingProduct, category_id: e.target.value })}
                                            className="w-full p-2.5 border border-malaga-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-malaga-300"
                                        >
                                            <option value="">Uncategorized</option>
                                            {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                                        </select>
                                        <label className="text-[10px] font-bold text-malaga-500 uppercase ml-1 block mt-2">Description</label>
                                        <textarea
                                            value={editingProduct.description}
                                            onChange={e => setEditingProduct({ ...editingProduct, description: e.target.value })}
                                            className="w-full p-2.5 border border-malaga-200 rounded-xl text-sm outline-none h-20 focus:ring-2 focus:ring-malaga-300"
                                        />
                                        <label className="text-[10px] font-bold text-malaga-500 uppercase ml-1 block mt-2">Image URL</label>
                                        <input
                                            value={editingProduct.image_url}
                                            onChange={e => setEditingProduct({ ...editingProduct, image_url: e.target.value })}
                                            className="w-full p-2.5 border border-malaga-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-malaga-300"
                                            placeholder="Image URL"
                                        />
                                        <div className="flex gap-2 pt-2">
                                            <button type="submit" className="flex-1 p-3 bg-green-600 text-white rounded-xl flex justify-center hover:bg-green-700 shadow-md transition-colors"><Check size={20} /></button>
                                            <button type="button" onClick={() => setEditingProduct(null)} className="flex-1 p-3 bg-gray-400 text-white rounded-xl flex justify-center hover:bg-gray-500 shadow-md transition-colors"><X size={20} /></button>
                                        </div>
                                    </form>
                                ) : (
                                    <>
                                        <div className="flex gap-4">
                                            <div className="w-20 h-20 flex-shrink-0 relative group">
                                                <img src={product.image_url} className="w-full h-full object-cover rounded-2xl shadow-sm" alt={product.name} />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex justify-between items-start">
                                                    <h3 className="font-bold text-malaga-900 truncate text-lg">{product.name}</h3>
                                                    <div className="flex gap-0.5">
                                                        <button
                                                            type="button"
                                                            onClick={() => setEditingProduct({ ...product })}
                                                            className="p-1.5 text-malaga-400 hover:text-malaga-600 hover:bg-malaga-50 rounded-lg transition-all"
                                                            title="Edit Product"
                                                        >
                                                            <Edit size={18} />
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={() => handleDeleteProduct(product.id)}
                                                            className="p-1.5 text-red-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                                                            title="Delete Product"
                                                        >
                                                            <Trash size={18} />
                                                        </button>
                                                    </div>
                                                </div>
                                                <span className="inline-block text-[10px] font-black text-malaga-500 uppercase tracking-widest bg-malaga-100/50 px-2 py-0.5 rounded-md mb-2">{product.category_name || 'Uncategorized'}</span>
                                            </div>
                                        </div>
                                        <p className="text-sm text-malaga-600 line-clamp-2 leading-relaxed italic border-l-2 border-malaga-200 pl-3">
                                            {product.description || "No description provided."}
                                        </p>
                                    </>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
