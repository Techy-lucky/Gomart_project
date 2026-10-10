import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { isAuthenticated } from "../../api/axios";
import '../../css files/ALLanimation.css'

function Aboutus() {

  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/');
    }
  }, [navigate]);

  return (
    <div className="anime mx-4 mt-4 font-outfit h-[84vh]  overflow-y-auto scroll-smooth
      [&::-webkit-scrollbar]:w-2
      [&::-webkit-scrollbar-track]:bg-transparent 
      [&::-webkit-scrollbar-thumb]:bg-gray-400/50
      [&::-webkit-scrollbar-thumb]:rounded-full
      dark:[&::-webkit-scrollbar-thumb]:bg-gray-600/50
      hover:[&::-webkit-scrollbar-thumb]:bg-gray-400
      dark:hover:[&::-webkit-scrollbar-thumb]:bg-gray-600">
      <div className="anime backdrop-blur-md bg-white/10 p-8 rounded-xl shadow-lg max-w-7xl border-2 border-gray-200/40 mx-auto">
        <h1 className="anime text-4xl font-bold text-gray-800 mb-6 text-center">About GoMart</h1>

        <div className="anime space-y-6 text-gray-700">
          <p className="text-lg">
            Welcome to GoMart, your one-stop destination for all your shopping needs. We are an innovative e-commerce platform dedicated to providing a seamless and enjoyable shopping experience for our customers.
          </p>

          <div className="bg-white/30 backdrop-blur-sm p-6 rounded-lg">
            <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
            <p>
              At GoMart, we strive to revolutionize the online shopping experience by offering a wide range of high-quality products, competitive prices, and exceptional customer service. Our platform is designed to make your shopping journey convenient, secure, and enjoyable.
            </p>
          </div>

          <div className="bg-white/30 backdrop-blur-sm p-6 rounded-lg">
            <h2 className="text-2xl font-semibold mb-4">Our Team</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-white/20 rounded-lg">
                <h3 className="font-semibold text-xl mb-2">Lakshit Verma</h3>
                <p className="text-gray-600">Team Lead & Mern stack Developer</p>
              </div>
              <div className="text-center p-4 bg-white/20 rounded-lg">
                <h3 className="font-semibold text-xl mb-2">Prahlad Vishwakarma</h3>
                <p className="text-gray-600">Frontend & Backend Developer</p>
              </div>
              <div className="text-center p-4 bg-white/20 rounded-lg">
                <h3 className="font-semibold text-xl mb-2">Ayush Fataniya</h3>
                <p className="text-gray-600">Frontend & database Developer</p>
              </div>
            </div>
          </div>

          <div className="bg-white/30 backdrop-blur-sm p-6 rounded-lg">
            <h2 className="text-2xl font-semibold mb-4">Why Choose GoMart?</h2>
            <ul className="list-disc list-inside space-y-2">
              <li>User-friendly interface with intuitive navigation</li>
              <li>Secure payment gateway and data protection</li>
              <li>Wide range of products from trusted sellers</li>
              <li>Fast delivery and excellent customer support</li>
              <li>Regular deals and discounts</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Aboutus;