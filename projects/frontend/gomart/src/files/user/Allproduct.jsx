import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { isAuthenticated } from '../../api/axios';
import { Link } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import '../../css files/ALLanimation.css'

const Allproduct = () => {
  const [products, setProducts] = useState([]);
  const [filters, setFilters] = useState({
    search: '',
    category: 'all',
    subcategory: 'all',
    priceRange: 'all',
    stock: 'all',
    sortBy: 'name'
  });
  const [visibleProducts, setVisibleProducts] = useState(8);

  const navigate = useNavigate();
  // Get unique categories and subcategories
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

  useEffect(() => {
    fetchProducts();
  });

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/');
    }
  }, [navigate]);


  const fetchProducts = async () => {
    try {
      const response = await axios.get('http://localhost:5000/products');
      if (response.data.success) {
        setProducts(response.data.products);
      }
    } catch (err) {
      console.error('Error:', err);
    }
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
    if (price < 5000) return '1000-5000';
    if (price < 10000) return '5000-10000';
    return '10000+';
  };

  const getStockRange = (stock) => {
    if (stock === 0) return 'out-of-stock';
    if (stock < 10) return 'low';
    if (stock < 50) return 'medium';
    return 'high';
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(filters.search.toLowerCase());
    const matchesCategory = filters.category === 'all' || product.category === filters.category;
    const matchesSubcategory = filters.subcategory === 'all' || product.subcategory === filters.subcategory;
    const matchesPriceRange = filters.priceRange === 'all' || getPriceRange(product.price) === filters.priceRange;
    const matchesStock = filters.stock === 'all' || getStockRange(product.stock) === filters.stock;

    return matchesSearch && matchesCategory && matchesSubcategory && matchesPriceRange && matchesStock;
  }).sort((a, b) => {
    switch (filters.sortBy) {
      case 'price-low': return a.price - b.price;
      case 'price-high': return b.price - a.price;
      case 'stock-low': return a.stock - b.stock;
      case 'stock-high': return b.stock - a.stock;
      default: return a.name.localeCompare(b.name);
    }
  });



  const handleAddToCart = async (product) => {
    console.log('Add to Cart clicked for:', product); // Debug log

    try {
      const token = localStorage.getItem("token");
      console.log('Token:', token); // Debugging

      if (!token) {
        toast.error("Please login first.");
        navigate("/");
        return;
      }

      const response = await axios.get("http://localhost:5000/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log('User Profile Data:', response.data); // Debug log

      if (!response.data || !response.data.fullName || !response.data.email) {
        toast.error("Failed to fetch user data.");
        return;
      }

      const { fullName, email } = response.data;

      const cartData = {
        productId: product.id,
        productName: product.name,
        price: product.price,
        quantity: 1,
        image: product.images[0].url,
        fullName,
        email,
      };

      console.log('Cart Data:', cartData); // Debug log

      const cartResponse = await axios.post('http://localhost:5000/api/cart', cartData);
      console.log('Cart Response:', cartResponse.data); // Debug log

      if (cartResponse.data.success) {
        toast.success('Product added to cart!');
      } else {
        toast.error('Failed to add product to cart.');
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error('An error occurred. Please try again.');
    }
  };


  const handleLoadMore = () => {
    setVisibleProducts(prev => prev + 8);
  };

  return (
    <div className="anime  mx-4 mt-4 font-outfit border-2 border-gray-200/40 bg-white/20 p-5 rounded-lg min-h-screen">
      {/* Filter Controls */}
      <div className="mb-6 space-y-4">
        <ToastContainer />
        <div className="anime grid grid-cols-1 md:grid-cols-5 gap-4">
          <select
            name="category"
            className="w-full px-4 py-2 rounded-xl border-2 bg-white/50  border-black/30 focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
            value={filters.category}
            onChange={handleFilterChange}
          >
            <option value="all">All Categories</option>
            {categories.filter(cat => cat !== 'all').map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>

          <select
            name="subcategory"
            className="w-full px-4 py-2 rounded-xl bg-white/50 border-2 border-black/30 focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
            value={filters.subcategory}
            onChange={handleFilterChange}
          >
            <option value="all">All Subcategories</option>
            {subcategories.filter(sub => sub !== 'all').map(sub => (
              <option key={sub} value={sub}>{sub}</option>
            ))}
          </select>

          <select
            name="priceRange"
            className="w-full px-4 py-2 rounded-xl bg-white/50 border-2 border-black/30 focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
            value={filters.priceRange}
            onChange={handleFilterChange}
          >
            <option value="all">All Prices</option>
            {priceRanges.filter(range => range !== 'all').map(range => (
              <option key={range} value={range}>₹{range}</option>
            ))}
          </select>

          <select
            name="stock"
            className="w-full px-4 py-2 rounded-xl bg-white/50 border-2 border-black/30 focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
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

          <select
            name="sortBy"
            className="w-full px-4 py-2 rounded-xl bg-white/50 border-2 border-black/30 focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
            value={filters.sortBy}
            onChange={handleFilterChange}
          >
            {sortOptions.map(option => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Products Grid */}
      <div className="h-[540px] font-outfit overflow-y-auto [&::-webkit-scrollbar]:w-2
      [&::-webkit-scrollbar-track]:bg-transparent 
      [&::-webkit-scrollbar-thumb]:bg-gray-400/50
      [&::-webkit-scrollbar-thumb]:rounded-full
      dark:[&::-webkit-scrollbar-thumb]:bg-gray-600/50
      hover:[&::-webkit-scrollbar-thumb]:bg-gray-400
      dark:hover:[&::-webkit-scrollbar-thumb]:bg-gray-600">
        <div className="grid grid-cols-1 ml-4 mr-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-4">
          {filteredProducts.slice(0, visibleProducts).map((product) => (
            <div key={product.id}
              className="anime product-card p-4 rounded-lg shadow-lg bg-white/30 
                        backdrop-blur-lg hover:shadow-xl border-2 border-gray-200/40 transition-all duration-300 
                        hover:-translate-y-1">
              <Link to={`/product/${product.id}`}
                className="text-blue-600 text-sm hover:text-blue-500">
                <img
                  src={product.images[0].url}
                  alt={product.name}
                  className="w-full h-40 object-contain bg-white rounded-lg"
                />
              </Link>

              <h4 className="mt-2  text-sm line-clamp-1 text-gray-800 text-center">{product.name}</h4>
              <div className='flex justify-evenly gap-5 items-center px-4 mt-2'>
                <p className="text-sm font-semibold text-black">₹{product.price}</p>
                <Link to={`/product/${product.id}`}
                  className="text-blue-600 text-sm hover:text-blue-500">
                  Read More
                </Link>
              </div>
              <div className="flex justify-center mt-4 gap-2">
                <button
                  onClick={() => handleAddToCart(product)}
                  className="px-4 py-2 font-light tracking-tighter text-sm  bg-white/40 text-black rounded-full 
                         hover:bg-black hover:text-white active:px-3 transition-colors"
                >
                  Add to Cart
                </button>
                <button
                  onClick={() => navigate('/processpage', {
                    state: {
                      products: [{
                        id: product.id,
                        name: product.name,
                        price: product.price,
                        quantity: 1,
                        image: product.images[0].url,
                        description: product.description,
                        category: product.category,
                        subcategory: product.subcategory
                      }]
                    }
                  })}
                  className="px-5 py-2 font-light bg-orange-500 text-white rounded-full text-sm
                         hover:bg-orange-600 transition-colors"
                >
                  Buy Now
                </button>
              </div>
            </div>
          ))}
        </div>
        {visibleProducts < filteredProducts.length && (
          <div className="flex justify-center mt-4">
            <button
              onClick={handleLoadMore}
              className="px-6 py-2 bg-white/40 text-black  font-light rounded-full 
                       hover:bg-orange-600 hover:text-white transition-all duration-300
                       transform hover:scale-"
            >
              Load More Products
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Allproduct;