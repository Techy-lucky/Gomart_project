import { useState, useEffect } from 'react';
import axios from '../../api/axios';
import search from "../../images/icon/search-circle-stroke-rounded.svg"
import "../../css files/productview.css"
import { toast, ToastContainer } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import '../../css files/ALLanimation.css'

function Productview() {
    const [products, setProducts] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [filters, setFilters] = useState({
        search: '',
        category: 'all',
        subcategory: 'all',
        priceRange: 'all',
        stock: 'all',
        sortBy: 'name'
    });
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
    const [updateFormData, setUpdateFormData] = useState(null);
    const [viewModalPosition, setViewModalPosition] = useState({ top: 0, left: 0 });
    const navigate = useNavigate();

    useEffect(() => {
        const fetchAdminProfile = async () => {
            try {
                await axios.get('http://localhost:5000/admin/profile', { withCredentials: true });
            } catch (error) {
                console.error('Failed to fetch admin profile:', error);
                toast.error('Session expired. Redirecting to login...');
                navigate('/adminlogin');
            }
        };
        fetchAdminProfile();
    }, [navigate]);

    useEffect(() => {
        fetchProducts();

        // Add resize listener
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleResize = () => {
        if (selectedProduct) {
            // Recalculate modal position on resize
            const viewportWidth = window.innerWidth;
            const viewportHeight = window.innerHeight;

            setViewModalPosition({
                top: Math.max(20, viewportHeight * 0.1),
                left: Math.max(20, viewportWidth * 0.1)
            });
        }
    };

    const fetchProducts = async () => {
        try {
            const response = await axios.get('/products');
            if (response.data.success) {
                setProducts(response.data.products);
            }
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    };

    const handleDelete = async (productId) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            try {
                const response = await axios.delete(`/admin/products/${productId}`);
                if (response.data.success) {
                    setSelectedProduct(null);
                    fetchProducts();
                }
            } catch (error) {
                console.error('Error deleting product:', error);
            }
        }
    };

    const handleView = (product) => {
        setSelectedProduct(product);

        // Calculate modal position based on viewport size
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;

        setViewModalPosition({
            top: Math.max(20, viewportHeight * 0.1),
            left: Math.max(20, viewportWidth * 0.1)
        });
    };

    const closeModal = () => {
        setSelectedProduct(null);
    };

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const getPriceRange = (price) => {
        if (price < 1000) return '0-1000';
        else if (price < 5000) return '1000-5000';
        else if (price < 10000) return '5000-10000';
        else return '10000+';
    };

    const getStockRange = (stock) => {
        if (stock === 0) return 'out-of-stock';
        else if (stock < 10) return 'low';
        else if (stock < 50) return 'medium';
        else return 'high';
    };

    const filteredProducts = products.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(filters.search.toLowerCase()) ||
            product.description.toLowerCase().includes(filters.search.toLowerCase());
        const matchesCategory = filters.category === 'all' || product.category.toLowerCase() === filters.category.toLowerCase();
        const matchesSubcategory = filters.subcategory === 'all' || product.subcategory.toLowerCase() === filters.subcategory.toLowerCase();
        const matchesPriceRange = filters.priceRange === 'all' || getPriceRange(product.price) === filters.priceRange;
        const matchesStock = filters.stock === 'all' || getStockRange(product.stock) === filters.stock;

        return matchesSearch && matchesCategory && matchesSubcategory && matchesPriceRange && matchesStock;
    }).sort((a, b) => {
        switch (filters.sortBy) {
            case 'price-low':
                return a.price - b.price;
            case 'price-high':
                return b.price - a.price;
            case 'stock-low':
                return a.stock - b.stock;
            case 'stock-high':
                return b.stock - a.stock;
            default:
                return a.name.localeCompare(b.name);
        }
    });

    const categories = ['all', ...new Set(products.map(product => product.category))];
    const subcategories = ['all', ...new Set(products.map(product => product.subcategory))];
    const priceRanges = ['all', '0-1000', '1000-5000', '5000-10000', '10000+'];
    const stockLevels = ['all', 'out-of-stock', 'low', 'medium', 'high'];
    const sortOptions = [
        { value: 'name', label: 'Name (A-Z)' },
        { value: 'price-low', label: 'Price (Low to High)' },
        { value: 'price-high', label: 'Price (High to Low)' },
        { value: 'stock-low', label: 'Stock (Low to High)' },
        { value: 'stock-high', label: 'Stock (High to Low)' }
    ];

    const handleUpdate = (product) => {
        setUpdateFormData({
            id: product.id,
            category: product.category,
            subcategory: product.subcategory,
            name: product.name,
            description: product.description,
            price: product.price,
            stock: product.stock
        });
        setIsUpdateModalOpen(true);
    };

    const handleUpdateSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.put(`/admin/products/${updateFormData.id}`, updateFormData);
            if (response.data.success) {
                setIsUpdateModalOpen(false);
                fetchProducts(); // Refresh the products list
                toast.success('Product updated successfully');
            }
        } catch (error) {
            console.error('Error updating product:', error);
            toast.error('Failed to update product');
        }
    };

    const handleUpdateChange = (e) => {
        const { name, value } = e.target;
        setUpdateFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    return (
        <div className="productview-container bg-white/30 backdrop-blur-md rounded-xl w-[97%] h-[94vh] mx-auto mt-5 p-5 font-outfit">
            <ToastContainer position="top-right" autoClose={3000} />
            {/* Search Bar */}
            <div className="productview-search-wrapper mb-3 relative">
                <h2 className='text-2xl font-light text-center mt-2 mb-4'>Product View</h2>
                <div className="productview-search-inner flex items-center">
                    <img src={search} alt="search" className="productview-search-icon absolute left-3 w-6 h-6" />
                    <input
                        type="text"
                        name="search"
                        placeholder="Search products..."
                        className="productview-search-input w-full pl-12 pr-4 py-3 rounded-xl bg-white/50 border border-black/30 focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                        value={filters.search}
                        onChange={handleFilterChange}
                    />
                </div>
            </div>

            {/* Filter Bar */}
            <div className="productview-filters mb-3 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
                <div>
                    {/* <label className="block text-sm font-medium text-gray-700 mb-1">Category</label> */}
                    <select
                        name="category"
                        className="productview-category-select w-full px-4 py-2 rounded-xl bg-white/50 border border-black/30 focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                        value={filters.category}
                        onChange={handleFilterChange}
                    >
                        <option value="all">All Categories</option>
                        {categories.filter(cat => cat !== 'all').map(category => (
                            <option key={category} value={category.toLowerCase()}>
                                {category}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    {/* <label className="block text-sm font-medium text-gray-700 mb-1">Subcategory</label> */}
                    <select
                        name="subcategory"
                        className="productview-subcategory-select w-full px-4 py-2 rounded-xl bg-white/50 border border-black/30 focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                        value={filters.subcategory}
                        onChange={handleFilterChange}
                    >
                        <option value="all">All Subcategories</option>
                        {subcategories.filter(sub => sub !== 'all').map(subcategory => (
                            <option key={subcategory} value={subcategory.toLowerCase()}>
                                {subcategory}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    {/* <label className="block text-sm font-medium text-gray-700 mb-1">Price Range</label> */}
                    <select
                        name="priceRange"
                        className="productview-price-select w-full px-4 py-2 rounded-xl bg-white/50 border border-black/30 focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                        value={filters.priceRange}
                        onChange={handleFilterChange}
                    >
                        <option value="all">All Prices</option>
                        {priceRanges.filter(range => range !== 'all').map(range => (
                            <option key={range} value={range}>
                                ₹{range}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    {/* <label className="block text-sm font-medium text-gray-700 mb-1">Stock Level</label> */}
                    <select
                        name="stock"
                        className="productview-stock-select w-full px-4 py-2 rounded-xl bg-white/50 border border-black/30 focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                        value={filters.stock}
                        onChange={handleFilterChange}
                    >
                        <option value="all">All Stock Levels</option>
                        {stockLevels.filter(level => level !== 'all').map(level => (
                            <option key={level} value={level}>
                                {level.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    {/* <label className="block text-sm font-medium text-gray-700 mb-1">Sort By</label> */}
                    <select
                        name="sortBy"
                        className="productview-sort-select w-full px-4 py-2 rounded-xl bg-white/50 border border-black/30 focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                        value={filters.sortBy}
                        onChange={handleFilterChange}
                    >
                        {sortOptions.map(option => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Products Table */}
            <div className="productview-table-container h-[calc(100%-165px)] overflow-y-auto px-2
    [&::-webkit-scrollbar]:w-2
      [&::-webkit-scrollbar-track]:bg-transparent 
      [&::-webkit-scrollbar-thumb]:bg-gray-400/50
      [&::-webkit-scrollbar-thumb]:rounded-full
      dark:[&::-webkit-scrollbar-thumb]:bg-gray-600/50
      hover:[&::-webkit-scrollbar-thumb]:bg-gray-400
      dark:hover:[&::-webkit-scrollbar-thumb]:bg-gray-600">
                <table className="anime productview-table w-full bg-white/50 rounded-xl">
                    <thead>
                        <tr className="anime productview-table-header text-left border-b">
                            <th className="productview-table-cell p-4">Image</th>
                            <th className="productview-table-cell p-4">Name</th>
                            <th className="productview-table-cell p-4">Category</th>
                            <th className="productview-table-cell p-4">Price</th>
                            <th className="productview-table-cell p-4">Stock</th>
                            <th className="productview-table-cell p-4">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredProducts.map((product) => (
                            <tr key={product.id} className="anime productview-table-row  border-b hover:bg-white/30 transition-colors">
                                <td className="productview-table-cell p-5">
                                    <img
                                        src={product.images[0]?.url}
                                        alt={product.name}
                                        className="productview-product-image w-16 h-16 object-cover rounded-lg cursor-pointer"
                                        onClick={() => handleView(product)}
                                    />
                                </td>
                                <td className="productview-table-cell p-4">{product.name}</td>
                                <td className="productview-table-cell p-4">{product.category}</td>
                                <td className="productview-table-cell p-4">₹{product.price}</td>
                                <td className="productview-table-cell p-4">{product.stock}</td>
                                <td className="productview-table-cell p-4">
                                    <div className="productview-actions flex gap-2">
                                        <button
                                            onClick={() => handleView(product)}
                                            className="productview-view-btn px-3 py-1 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors text-sm"
                                        >
                                            View
                                        </button>
                                        <button
                                            onClick={() => handleUpdate(product)}
                                            className="productview-update-btn px-3 py-1 bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors text-sm"
                                        >
                                            Update
                                        </button>
                                        <button
                                            onClick={() => handleDelete(product.id)}
                                            className="productview-delete-btn px-3 py-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors text-sm"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Product Details Modal */}
            {selectedProduct && (
                <div
                    className="productview-modal fixed bg-black/50 backdrop-blur-sm z-50 overflow-auto"
                    style={{
                        top: viewModalPosition.top,
                        left: viewModalPosition.left,
                        right: viewModalPosition.left,
                        bottom: viewModalPosition.top,
                        maxWidth: '80vw',
                        maxHeight: '80vh',
                        margin: 'auto'
                    }}
                >
                    <div className="productview-modal-content bg-white/95 rounded-xl w-full h-full overflow-y-auto custom-scrollbar">
                        <div className="productview-modal-header sticky top-0 bg-white/95 p-4 border-b flex justify-between items-center">
                            <h2 className="productview-modal-title text-2xl font-semibold">{selectedProduct.name}</h2>
                            <button
                                onClick={closeModal}
                                className="productview-modal-close text-gray-500 hover:text-gray-700 text-2xl"
                            >
                                ×
                            </button>
                        </div>

                        <div className="productview-modal-body p-3">
                            <div className="productview-modal-grid grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="productview-modal-images space-y-4">
                                    <div className="productview-modal-main-image rounded-xl overflow-hidden">
                                        <img
                                            src={selectedProduct.images[0]?.url}
                                            alt={selectedProduct.name}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <div className="productview-modal-thumbnails flex gap-2 overflow-x-auto pb-2 custom-scrollbar">
                                        {selectedProduct.images.map((image, index) => (
                                            <img
                                                key={index}
                                                src={image.url}
                                                alt={`${selectedProduct.name} ${index + 1}`}
                                                className="productview-modal-thumbnail w-20 h-20 object-cover rounded-xl cursor-pointer hover:opacity-75 transition-opacity"
                                            />
                                        ))}
                                    </div>
                                </div>

                                <div className="productview-modal-details space-y-6">
                                    <div className="productview-modal-info-grid grid grid-cols-2 gap-4">
                                        <div className="productview-modal-info-item bg-white/50 p-4 rounded-xl">
                                            <h3 className="productview-modal-info-label text-sm font-medium text-gray-600">Category</h3>
                                            <p className="productview-modal-info-value text-lg font-medium mt-1">{selectedProduct.category}</p>
                                        </div>
                                        <div className="productview-modal-info-item bg-white/50 p-4 rounded-xl">
                                            <h3 className="productview-modal-info-label text-sm font-medium text-gray-600">Subcategory</h3>
                                            <p className="productview-modal-info-value text-lg font-medium mt-1">{selectedProduct.subcategory}</p>
                                        </div>
                                        <div className="productview-modal-info-item bg-white/50 p-4 rounded-xl">
                                            <h3 className="productview-modal-info-label text-sm font-medium text-gray-600">Price</h3>
                                            <p className="productview-modal-info-value text-lg font-medium text-green-600 mt-1">₹{selectedProduct.price}</p>
                                        </div>
                                        <div className="productview-modal-info-item bg-white/50 p-4 rounded-xl">
                                            <h3 className="productview-modal-info-label text-sm font-medium text-gray-600">Stock</h3>
                                            <p className="productview-modal-info-value text-lg font-medium mt-1">{selectedProduct.stock} units</p>
                                        </div>
                                    </div>

                                    <div className="productview-modal-description bg-white/50 p-4 rounded-xl">
                                        <h3 className="productview-modal-info-label text-sm font-medium text-gray-600">Description</h3>
                                        <p className="productview-modal-info-value mt-2 text-gray-700">{selectedProduct.description}</p>
                                    </div>

                                    <div className="productview-modal-created bg-white/50 p-4 rounded-xl">
                                        <h3 className="productview-modal-info-label text-sm font-medium text-gray-600">Created At</h3>
                                        <p className="productview-modal-info-value text-gray-700 mt-1">
                                            {new Date(selectedProduct.createdAt).toLocaleDateString('en-US', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric'
                                            })}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Update Modal */}
            {isUpdateModalOpen && updateFormData && (
                <div className="anime fixed inset-0 bg-white/20 rounded-md backdrop-blur-sm flex items-center justify-center p-4 z-50">
                    <div className="bg-white/95 rounded-xl max-w-2xl w-full p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="anime text-2xl font-semibold">Update Product</h2>
                            <button
                                onClick={() => setIsUpdateModalOpen(false)}
                                className="anime text-gray-500 hover:text-gray-700 text-2xl"
                            >
                                ×
                            </button>
                        </div>

                        <form onSubmit={handleUpdateSubmit} className="space-y-4">
                            <div className="anime grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                                    <select
                                        name="category"
                                        value={updateFormData.category}
                                        onChange={handleUpdateChange}
                                        className="w-full p-2 rounded-xl bg-white/50 border border-black/30"
                                        required
                                    >
                                        {categories.map((category, index) => (
                                            <option key={index} value={category.toLowerCase()}>
                                                {category}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Subcategory</label>
                                    <select
                                        name="subcategory"
                                        value={updateFormData.subcategory}
                                        onChange={handleUpdateChange}
                                        className="w-full p-2 rounded-xl bg-white/50 border border-black/30"
                                        required
                                    >
                                        {subcategories.map((subcategory, index) => (
                                            <option key={index} value={subcategory.toLowerCase()}>
                                                {subcategory}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={updateFormData.name}
                                        onChange={handleUpdateChange}
                                        className="w-full p-2 rounded-xl bg-white/50 border border-black/30"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
                                    <input
                                        type="number"
                                        name="price"
                                        value={updateFormData.price}
                                        onChange={handleUpdateChange}
                                        className="w-full p-2 rounded-xl bg-white/50 border border-black/30"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Stock</label>
                                    <input
                                        type="text"
                                        name="stock"
                                        value={updateFormData.stock}
                                        onChange={handleUpdateChange}
                                        className="w-full p-2 rounded-xl bg-white/50 border border-black/30"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="anime block text-sm font-medium text-gray-700 mb-1">Description</label>
                                <textarea
                                    name="description"
                                    value={updateFormData.description}
                                    onChange={handleUpdateChange}
                                    rows="4"
                                    className="anime w-full p-2 rounded-xl bg-white/50 border border-black/30"
                                    required
                                />
                            </div>

                            <div className="anime flex justify-end gap-2">
                                <button
                                    type="button"
                                    onClick={() => setIsUpdateModalOpen(false)}
                                    className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                                >
                                    Update Product
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Productview;
