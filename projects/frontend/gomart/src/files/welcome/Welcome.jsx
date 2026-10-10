import { Link } from "react-router-dom";
import "../../css files/Welcome.css";
import img1 from "../../images/img/Shopping-cart-with-gift-boxes-and-shopping-bags-from-online-shop-for-e-commerce-marketing-on-transparent-PNG.png";
import { useEffect, useState } from "react";

const Welcome = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Add a small delay before showing the content
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="welcome-container min-h-screen flex items-center justify-center relative">
      <div className="welcome-inner-container container mx-auto px-4">
        <div className={`welcome-content-wrapper flex flex-col items-center justify-center backdrop-blur-md bg-white/10 rounded-xl px-8 py-8 mx-10 shadow-lg  border-2  border-gray-400/20 transition-all duration-1500 ease-in-out ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className={`welcome-image-container w-full flex justify-center mb-8 transition-all duration-1500 ease-in-out delay-300 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <img src={img1} alt="Shopping Experience" className="welcome-image w-[350px] h-[250px] hover:scale-105" />
          </div>

          <div className="welcome-text-container w-full text-center">
            <h1 className={`welcome-heading text-4xl md:text-6xl font-light text-gray-900 mb-4 font-outfit transition-all duration-1500 ease-in-out delay-500 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
              Welcome to <span className="welcome-brand-name font-bold">GoMart</span>
            </h1>
            <p className={`welcome-subtext text-lg text-gray-800 mb-8 font-outfit transition-all duration-1500 ease-in-out delay-700 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
              Discover a new way to shop online
            </p>
            <div className={`welcome-buttons-container flex gap-4 justify-center transition-all duration-1500 ease-in-out delay-900 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
              <Link
                to="/login"
                className="welcome-login-button px-6 py-2 bg-black text-white rounded hover:bg-white hover:text-black border border-black transition-all duration-300 ease-in-out font-outfit"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="welcome-register-button px-6 py-2 border border-black text-black rounded hover:bg-gray-50 transition-all duration-300 ease-in-out font-outfit"
              >
                Register
              </Link>
            </div>
          </div>
        </div>
      </div>
      <Link
        to="/unknown"
        className={`welcome-help-button px-2.5 py-1 text-black rounded-full hover:bg-gray-50 transition-all duration-300 ease-in-out md:block absolute bottom-4 right-4 font-outfit  duration-1500 delay-1000 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
      >

      </Link>
    </div>
  );
};

export default Welcome;
