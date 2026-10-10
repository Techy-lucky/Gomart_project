import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../../api/axios';
import { toast, ToastContainer } from 'react-toastify';
import '../../css files/ALLanimation.css'

function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const [cartCount, setCartCount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        // const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5000/api/cart', {
          // headers: { Authorization: `Bearer ${token}` },
        });

        if (response.data.success) {
          setCartItems(response.data.cartItems);
          updateCartCount(response.data.cartItems);
        } else {
          toast.error(response.data.message);
        }
      } catch (error) {
        console.error('Error fetching cart items:', error);
        toast.error('An error occurred. Please try again.');
      }
    };

    fetchCartItems();
  }, []);

  const updateCartCount = (items) => {
    const count = items.reduce((total, item) => total + item.quantity, 0);
    setCartCount(count);
  };

  const handleQuantityChange = (index, delta) => {
    const updatedCartItems = [...cartItems];
    updatedCartItems[index].quantity += delta;
    if (updatedCartItems[index].quantity < 1) {
      updatedCartItems[index].quantity = 1;
    }
    setCartItems(updatedCartItems);
    updateCartCount(updatedCartItems);
  };

  const handleRemoveItem = async (index) => {
    try {
      const cartItemId = cartItems[index]._id; // Get the item ID from cartItems

      // Send DELETE request to the backend
      const response = await axios.delete(`http://localhost:5000/api/cart/${cartItemId}`);

      if (response.data.success) {
        toast.success('Item removed from cart!');

        // Update the cart state after successful deletion
        const updatedCartItems = cartItems.filter((_, i) => i !== index);
        setCartItems(updatedCartItems);
        updateCartCount(updatedCartItems);
      } else {
        toast.error(response.data.message || 'Failed to remove item');
      }
    } catch (error) {
      console.error('Error removing item from cart:', error);
      toast.error('An error occurred. Please try again.');
    }
  };

  useEffect(() => {
    console.log('Cart Items:', cartItems);
  }, [cartItems]);



  const handleCheckout = () => {
    console.log('Navigating with cartItems:', cartItems);
    navigate('/processpage', { state: { cartItems } });
  };


  return (
    <div className="anime min-h-screen font-outfit py-5 px-6">
      <div className="w-full mx-auto h-[83vh] border-2 border-gray-200/40 bg-white/10 backdrop-blur-md rounded-2xl shadow-xl">
        <div className="p-6">
          <h2 className="text-2xl font-light mb-6 text-center text-gray-800">
            Shopping Cart ({cartCount})
          </h2>
          <ToastContainer />
          <div className="overflow-y-auto max-h-[54vh] 
          [&::-webkit-scrollbar]:w-2
          [&::-webkit-scrollbar-track]:bg-transparent
        [&::-webkit-scrollbar-thumb]:bg-gray-800/50
          [&::-webkit-scrollbar-thumb]:rounded-full space-y-2">
            {cartItems.length > 0 ? (
              cartItems.map((item, index) => (
                <div
                  key={index}
                  className="anime flex items-center justify-center align-middle content-center bg-white/20  backdrop-blur-sm rounded-xl p-3"
                >
                  <div className="relative h-20 w-20 rounded-lg overflow-hidden bg-white/30">

                    <img
                      src={item.image}
                      alt={item.productName}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="ml-4 flex-1">
                    <h3 className="font-semibold text-gray-800">{item.productName}</h3>
                    <p className="text-gray-600 text-sm">₹{item.price}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleQuantityChange(index, -1)}
                      className="w-8 h-8 text-gray-600"
                    >
                      -
                    </button>
                    <span>{item.quantity}</span>
                    <button
                      onClick={() => handleQuantityChange(index, 1)}
                      className="w-8 h-8 text-gray-600"
                    >
                      +
                    </button>
                    <button
                      onClick={() => handleRemoveItem(index)}
                      className="p-2 text-red-500 hover:text-red-700 transition-colors"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-600">Your cart is empty</div>
            )}
          </div>

          {cartItems.length > 0 && (
            <div className="anime mt-6 border-t  border-gray-200/50 pt-4">
              <div className="flex justify-end gap-5 items-baseline">
                <p className="text-lg ">Total Amount:  ₹ {cartItems.reduce(
                  (total, item) => total + item.price * item.quantity,
                  0
                )}</p>
                <p className="text-2xl font-bold">

                </p>
                <button onClick={handleCheckout} className="bg-blue-600 hover:bg-blue-700 active:px-4 border-2 border-gray-200/40 rounded-full text-white px-6 py-3">
                  Proceed to Checkout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Cart;
