import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import '../../css files/ALLanimation.css'

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [feedback, setFeedback] = useState("");
  const [reviews, setReviews] = useState([]);
  // const [selectedSize, setSelectedSize] = useState(null);
  const [showFullDescription, setShowFullDescription] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:5000/product/${id}`);
        if (response.data.success) {
          setProduct(response.data.product);
        }
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchFeedback = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/product/${id}/feedback`);
        if (response.data.success) {
          setReviews(response.data.feedback); // ✅ Update state with fetched feedback
        }
      } catch (error) {
        console.error("Error fetching feedback:", error);
      }
    };

    fetchProduct();
    fetchFeedback(); // ✅ Fetch feedback whenever product changes
  }, [id]);
  const handleFeedbackSubmit = async () => {
    if (!feedback.trim()) {
      toast.error("Feedback cannot be empty");
      return;
    }

    try {
      // ✅ Fetch the logged-in user's name from local storage
      const userFullName = localStorage.getItem("userFullName"); // Make sure this is stored on login
      if (!userFullName) {
        toast.error("User not found. Please log in.");
        return;
      }

      console.log("Submitting feedback as:", userFullName);

      const response = await fetch(`http://localhost:5000/product/${id}/feedback`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ user: userFullName, comment: feedback }), // ✅ Use real user name
      });

      const data = await response.json();
      console.log("API Response:", data);

      if (response.ok) {
        setReviews([...reviews, data.review]); // ✅ Add new review to state
        setFeedback(""); // ✅ Clear input after submission
        toast.success("Feedback submitted!");
      } else {
        toast.error(data.message || "Failed to send feedback");
      }
    } catch (error) {
      console.error("Error submitting feedback:", error);
      toast.error("Something went wrong");
    }
  };


  if (loading) {
    return (
      <></>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto p-6 text-center">
        <p className="text-xl">Product not found</p>
        <button
          onClick={() => navigate(-1)}
          className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-lg"
        >
          Go Back
        </button>
      </div>
    );
  }

  const handleAddToCart = async (product) => {
    console.log('Add to Cart clicked for:', product); // Debugging log
    try {
      const fullName = localStorage.getItem('userFullName');
      const email = localStorage.getItem('userEmail');

      if (!fullName || !email) {
        toast.error('User information is missing. Please login first.');
        return;
      }

      const cartData = { productId: product.id, productName: product.name, price: product.price, quantity: 1, image: product.images[0].url, fullName, email };

      const response = await axios.post('http://localhost:5000/api/cart', cartData);
      if (response.data.success) {
        toast.success('Product added to cart!');
      } else {
        toast.error('Failed to add product to cart.');
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error('An error occurred. Please try again.');
    }
  };

  return (
    <div className="anime flex items-center justify-center min-h-screen p-6">
      < ToastContainer />
      <div className="anime bg-white/20 backdrop-blur-md rounded-xl shadow-lg border-2 border-gray-200/40 max-w-[205vh] flex w-full">
        {/* Left Section - Image */}
        <button
          onClick={() => navigate(-1)}
          className="absolute top-4 left-4 bg-black text-white border hover:border-black  px-4 py-2 rounded-full shadow hover:bg-white  hover:text-black "
        >
          X
        </button>
        {/* Right Section - Product Info */}
        <div className="anime w-1/3 p-5 flex flex-col h-[520px]">
          {/* Fixed Header Content */}
          <div className="anime space-y-2">
            <h1 className="anime font-bold text-black text-1xl text-center uppercase px-3 py-2 rounded-full tracking-widest">
              {product.brand || "Gomart"}
            </h1>
            <h2 className="anime text-2xl text-center font-light">{product.name}</h2>
          </div>

          {/* Scrollable Content */}
          <div className="anime flex-1 overflow-y-auto my-4 pr-2
                       [&::-webkit-scrollbar]:w-2
                       [&::-webkit-scrollbar-track]:bg-transparent
                       [&::-webkit-scrollbar-thumb]:bg-gray-300
                       [&::-webkit-scrollbar-thumb]:rounded-full">
            {/* Description */}
            <div>
              <h3 className="anime text-lg font-semibold text-justify mb-2">Description</h3>
              <p className="anime text-gray-900 text-center">
                {showFullDescription ? product.description : `${product.description.substring(0, 150)}...`}
                <button
                  onClick={() => setShowFullDescription(!showFullDescription)}
                  className="anime text-blue-600 ml-2 hover:underline"
                >
                  {showFullDescription ? "Show Less" : "Read More"}
                </button>
              </p>
            </div>
          </div>
          <div>
            <p className="anime text-lg mb-5 text-black flex justify-center">₹ {product.price}</p>
          </div>
          <div className="anime mb-10 flex justify-center">
            <div className="anime flex items-center">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="anime w-10 h-10 rounded-full bg-gray-200  flex items-center justify-center"
              >
                -
              </button>
              <span className="anime w-16 text-center text-xl">{quantity}</span>
              <button
                onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                className="anime w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center"
              >
                +
              </button>
            </div>


          </div>
          {/* Fixed Bottom Content */}
          <div className="anime space-y-6">
            {/* Quantity Selector */}

            {/* Action Buttons */}
            <div className="flex justify-center space-x-3">
              <button
                onClick={() => handleAddToCart(product)}
                disabled={product.stock <= 0}
                className=" bg-white/40 text-black px-8 py-3 rounded-full hover:bg-black hover:text-white
                         disabled:opacity-50 disabled:cursor-not-allowed active:px-6 "
              >
                Add to Cart
              </button>
              <button
                onClick={() => navigate('/processpage', {
                  state: {
                    products: [{
                      id: product._id,
                      name: product.name,
                      price: product.price,
                      quantity: quantity,
                      image: product.images[0].url,
                      description: product.description,
                      category: product.category,
                      subcategory: product.subcategory
                    }]
                  }
                })}
                disabled={product.stock <= 0}
                className=" bg-orange-500 text-black px-10 py-3 rounded-full hover:bg-orange-600
           disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Buy Now
              </button>
            </div>
          </div>
        </div>
        <div className="anime relative w-1/3 h-[520px]">
          <img
            src={product.images[0]?.url || "https://via.placeholder.com/500"}
            alt={product.name}
            className="anime w-full h-full object-contain bg-white p-16 "
          />

        </div>
        {/* third section */}
        {/* Third Section - Feedback */}
        <div className="anime relative w-1/3 font-outfit h-[520px] flex flex-col justify-between p-4 ">
          {/* Top Section - View Feedback */}
          <div className="anime overflow-y-auto max-h-96 p-4 rounded-lg [&::-webkit-scrollbar]:w-2
                       [&::-webkit-scrollbar-track]:bg-transparent
                       [&::-webkit-scrollbar-thumb]:bg-gray-500
                       [&::-webkit-scrollbar-thumb]:rounded-full">
            <h3 className="anime text-center font-semibold text-gray-800 text-lg mb-2">Customer Feedback</h3>
            {reviews.length > 0 ? (
              reviews.map((review, index) => (
                <div key={index} className="anime p-3 bg-white/10 backdrop-blur-md rounded-lg shadow-sm border border-gray-300/20 mb-2 ">
                  <p className="anime text-sm font-medium text-gray-800">{review.user}</p>
                  <p className="anime text-sm text-gray-600">{review.comment}</p>
                </div>
              ))
            ) : (
              <p className="anime text-center text-gray-400 text-sm">No feedback yet. Be the first to review!</p>
            )}
          </div>

          {/* Bottom Section - Add Feedback */}
          <div className="anime flex flex-col rounded-lg p-1">
            <div className="relative w-full">
              <textarea
                className="w-full bg-transparent border resize-none border-black rounded-lg p-3 text-sm placeholder-gray-700 text-gray-900 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                rows="3"
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="Share your experience..."
              ></textarea>
              <button
                onClick={handleFeedbackSubmit}
                className="absolute bottom-3 right-3 px-3 py-2 bg-blue-600/80 text-white text-sm font-medium rounded-full hover:bg-blue-600/90 transition duration-300"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;



