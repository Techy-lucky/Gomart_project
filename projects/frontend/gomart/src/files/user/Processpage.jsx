import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from '../../api/axios';
import { isAuthenticated } from '../../api/axios';
import StepProgress from '../../components/StepProgress';
import '../../css files/ALLanimation.css';

const ProcessPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [isExpressDelivery, setIsExpressDelivery] = useState(false);
  // const queryParams = new URLSearchParams(location.search);

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/');
    }
  }, [navigate]);

  useEffect(() => {
    if (location.state?.products) {
      setProducts(location.state.products);
    } else if (location.state?.cartItems) {
      setProducts(location.state.cartItems);
    } else {
      const storedItems = localStorage.getItem('cartItems');
      if (storedItems) {
        setProducts(JSON.parse(storedItems));
      } else {
        navigate('/');
      }
    }
  }, [location.state, navigate]);

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    address: '',
    pincode: '',
    city: '',
    contact: ''
  });

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          toast.error("Please login first.");
          navigate("/");
          return;
        }

        const response = await axios.get("/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.data) {
          setFormData((prev) => ({
            ...prev,
            fullName: response.data.fullName || "",
            email: response.data.email || "",
          }));
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
        toast.error("Session expired. Please login again.");
        navigate("/");
      }
    };

    fetchUserProfile();
  }, [navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    if (!formData.fullName.trim()) {
      toast.error('Please enter your full name');
      return false;
    }
    if (!formData.email.trim()) {
      toast.error('Please enter your email');
      return false;
    }
    if (!formData.address.trim()) {
      toast.error('Please enter your address');
      return false;
    }
    if (!formData.pincode.trim() || !/^\d{6}$/.test(formData.pincode)) {
      toast.error('Please enter a valid 6-digit pincode');
      return false;
    }
    if (!formData.city) {
      toast.error('Please select your city');
      return false;
    }
    if (!formData.contact.trim() || !/^\d{10}$/.test(formData.contact)) {
      toast.error('Please enter a valid 10-digit contact number');
      return false;
    }
    return true;
  };

  const calculateSubtotal = () => {
    return products.reduce((total, product) => total + product.price * product.quantity, 0);
  };

  const getDeliveryCharge = () => {
    return isExpressDelivery ? 100 : 40;
  };

  const calculateTotal = () => {
    return calculateSubtotal() + getDeliveryCharge();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const totalAmount = calculateTotal();

    try {
      const orderData = {
        products,
        deliveryInfo: formData,
        totalAmount,
      };

      navigate(`/payment?amount=${totalAmount}`, { state: { orderData } });
    } catch (error) {
      console.error("Order placement failed:", error);
      toast.error("Failed to place order. Please try again.");
    }
  };

  return (
    <div className="min-h-screen font-outfit py-8 px-4 sm:px-6 lg:px-8">
      <StepProgress currentStep={1} />

      <button
        onClick={() => navigate(-1)}
        className="anime back-button absolute top-4 left-4 text-black font-outfit flex items-center px-5 py-2 rounded-sm border border-black hover:text-white hover:bg-blue-500 bg-white/30 backdrop-blur-sm transition-all duration-300"
      >
        Back
      </button>

      <div className="w-full max-w-5xl border-2 border-gray-200/40 mx-auto bg-white/30 backdrop-blur-md shadow-2xl rounded-xl p-8">
        <h1 className="anime text-3xl font-bold text-gray-800 text-center mb-5">Complete Your Order</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="anime flex flex-col">
            <h2 className="text-xl font-semibold text-center text-gray-700 mb-2 sticky top-0 z-10">
              Delivery Information
            </h2>
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <input
                  type="text"
                  name="fullName"
                  placeholder='Full Name'
                  value={formData.fullName}
                  readOnly
                  className="mt-1 block w-full placeholder:text-gray-700 placeholder:font-bold outline-none rounded-lg border border-gray-300 shadow-sm p-3 bg-white/40 backdrop-blur-sm"
                />
              </div>
              <div>
                <input
                  type="email"
                  name="email"
                  placeholder='E-mail'
                  value={formData.email}
                  readOnly
                  className="mt-1 block w-full placeholder:text-gray-700 placeholder:font-bold outline-none rounded-lg border border-gray-300 shadow-sm p-3 bg-white/40 backdrop-blur-sm"
                />
              </div>
              <div>
                <textarea
                  name="address"
                  placeholder='Address'
                  value={formData.address}
                  onChange={handleInputChange}
                  rows="4"
                  className="mt-1 block w-full h-24 resize-none placeholder:text-gray-700 
                           placeholder:font-bold outline-none rounded-lg border 
                           border-gray-300 shadow-sm p-3 focus:ring-blue-500 
                           focus:border-blue-500 bg-white/40 backdrop-blur-sm
                           transition-all duration-300"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <input
                    type="text"
                    name="pincode"
                    placeholder='Pincode'
                    value={formData.pincode}
                    onChange={handleInputChange}
                    className="mt-1 block placeholder:text-gray-700 placeholder:font-bold outline-none w-full rounded-lg border border-gray-300 shadow-sm p-3 
                               focus:ring-blue-500 focus:border-blue-500 bg-white/40 backdrop-blur-sm"
                    required
                  />
                </div>
                <div>
                  <select
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    className="mt-1 block font-bold w-full outline-none rounded-lg border border-gray-300 shadow-sm p-3 
                               focus:ring-blue-500 focus:border-blue-500 bg-white/40 backdrop-blur-sm"
                    required
                  >
                    <option value="">Select City</option>
                    <option value="surat">Surat</option>
                    <option value="ahmedabad">Ahmedabad</option>
                    <option value="jaipur">Jaipur</option>
                    <option value="jodhpur">Jodhpur</option>
                  </select>
                </div>
              </div>
              <div>
                <input
                  type="tel"
                  name="contact"
                  placeholder='contact'
                  value={formData.contact}
                  onChange={handleInputChange}
                  className="mt-1 block placeholder:text-gray-700 placeholder:font-outfit placeholder:font-bold w-full outline-none rounded-lg border border-gray-300 shadow-sm p-3 
                             focus:ring-blue-500 focus:border-blue-500 bg-white/40 backdrop-blur-sm"
                  required
                />
              </div>
            </form>
          </div>

          {/* Right Side - Order Summary */}
          <div className="anime flex flex-col mt-3 h-[calc(100vh-260px)]">
            <h2 className="text-xl text-center font-semibold text-gray-700 mb-4 sticky top-0 z-10">
              Order Summary
            </h2>

            {/* Scrollable Product List */}
            <div className="flex-1 overflow-y-auto pr-2
                scrollbar-thin scrollbar-thumb-gray-400/60 
                scrollbar-track-transparent
                hover:scrollbar-thumb-gray-400
                [&::-webkit-scrollbar]:w-1.5
                [&::-webkit-scrollbar-track]:bg-transparent
              [&::-webkit-scrollbar-thumb]:bg-gray-300/50
                [&::-webkit-scrollbar-thumb]:rounded-full
              hover:[&::-webkit-scrollbar-thumb]:bg-gray-400/70
                [&::-webkit-scrollbar-thumb]:transition-colors
                [&::-webkit-scrollbar-thumb]:duration-300 ">
              <div className="space-y-3">
                {products.map((product, index) => (
                  <div key={index} className="flex items-center p-3 bg-white/20 backdrop-blur-sm rounded-lg">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-14 h-14 object-cover rounded-lg flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0 ml-3">
                      <h3 className="font-semibold truncate text-sm">{product.name || product.productName}</h3>
                      <p className="text-xs text-gray-600">Quantity: {product.quantity}</p>
                      <p className="text-xs text-gray-600">₹{product.price}</p>
                    </div>
                    <p className="font-semibold text-sm whitespace-nowrap">
                      ₹{product.price * product.quantity}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Fixed Summary Footer */}
            <div className="mt-5 pt-5 border-t border-gray-200/50">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>₹{calculateSubtotal()}</span>
                </div>

                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <span>Express Delivery</span>
                    <input
                      type="checkbox"
                      checked={isExpressDelivery}
                      onChange={(e) => setIsExpressDelivery(e.target.checked)}
                      className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    {isExpressDelivery && (
                      <span className="text-xs text-black">
                        (Delivery within 2 hours)
                      </span>
                    )}
                  </div>
                  <span>
                    {isExpressDelivery ? '+₹60' : '-'}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span>Total delivery</span>
                  <span>₹{getDeliveryCharge()}</span>
                </div>

                <div className="flex justify-between font-semibold text-base">
                  <span>Total</span>
                  <span>₹{calculateTotal()}</span>
                </div>
              </div>
              <button
                type="submit"
                onClick={handleSubmit}
                className="w-full bg-orange-600  text-white py-3 rounded-lg mt-3
                         shadow-lg hover:text-black outline-none transition-all 
                         duration-300 text-sm"
              >
                Place Order
              </button>
            </div>
          </div>
        </div>
      </div>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <ToastContainer />
    </div>
  );
};
export default ProcessPage;
