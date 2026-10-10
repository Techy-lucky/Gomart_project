import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const Electronic = () => {
  const navigate = useNavigate();
  const [electronicsProducts, setElectronicsProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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


  const fetchElectronicsProducts = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5000/products/fashion');
      if (response.data.success) {
        setElectronicsProducts(response.data.products);
      } else {
        setError('Failed to fetch products');
      }
    } catch (error) {
      console.error('Error fetching electronics products:', error);
      setError('Error loading products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchElectronicsProducts();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-8 text-red-500">
        {error}
      </div>
    );
  }

  return (
    <div name="product-list" className="flex mt-8 ml-8 mr-8 flex-col font-outfit border-2 border-gray-200/40 bg-white/20 p-4  rounded-b-[40px] rounded-t-3xl">
      <div className='flex justify-between items-center p-2'>
        <h1 className='text-lg  font-light bg-white/40 border-2 border-gray-200/40 hover:bg-orange-500 rounded-full px-4 py-2'>Fashions</h1>
        <Link to="/products/fashion" className="text-zinc-900 bg-white/40 border-2 hover:bg-orange-500  border-gray-200/40 px-4  active:px-3 py-2  text-sm rounded-full">View All</Link>
      </div>

      <div name="electronics-products" className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-2">
        {electronicsProducts.map(product => (
          <div key={product.id}
            className="product-card p-4 rounded-3xl shadow-lg bg-white/30 
                        backdrop-blur-lg hover:shadow-xl transition-all duration-300 
                        hover:-translate-y-1">

            <Link to={`/product/${product.id}`}
              className="text-blue-600 text-sm hover:text-blue-500">
              <img
                src={product.images[0].url}
                alt={product.name}
                className="w-full h-40 object-contain bg-white rounded-lg"
              />
            </Link>
            <h4 className="mt-2 font-normal text-sm text-gray-800 line-clamp-1 text-center">{product.name}</h4>
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
                className="px-4 py-2 bg-white/40 text-black rounded-full font-light text-sm
                         hover:bg-black hover:text-white transition-colors active:px-3 "
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
                className="px-5 py-2 bg-orange-500 text-white font-light rounded-full text-sm 
                         hover:bg-orange-600 transition-colors"
              >
                Buy Now
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Electronic;