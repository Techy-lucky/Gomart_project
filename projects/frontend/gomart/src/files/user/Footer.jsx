import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="bg-white/20 text-black border-2 border-gray-200/40 bottom-2 rounded-lg mt-6  pt-12 mb-28 px-4 shadow-lg">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {/* Company Info */}
                <div className="space-y-4">
                    <h3 className="text-xl font-bold mb-4">GoMart</h3>
                    <p className="text-sm text-gray-800">
                        Your one-stop destination for all your shopping needs. Quality products, great prices, and excellent service.
                    </p>
                    <div className="flex space-x-4">
                        <a href="https://facebook.com" className="text-blue-600 transition-colors">
                            <i className="fab fa-facebook-f text-xl"></i>
                        </a>
                        <a href="https://twitter.com" className="text-blue-400 transition-colors">
                            <i className="fab fa-twitter text-xl"></i>
                        </a>
                        <a href="https://instagram.com" className="text-pink-500 transition-colors">
                            <i className="fab fa-instagram text-xl"></i>
                        </a>
                        <a href="https://linkedin.com" className="text-blue-700 transition-colors">
                            <i className="fab fa-linkedin-in text-xl"></i>
                        </a>
                    </div>
                </div>

                {/* Quick Links */}
                <div>
                    <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
                    <ul className="space-y-2">
                        <li><Link to="/homepage" className="hover:text-white  text-gray-900 transition-colors">Home</Link></li>
                        <li><Link to="/allproducts" className="hover:text-white  text-gray-900 transition-colors">Products</Link></li>
                        <li><Link to="/aichat" className="hover:text-white  text-gray-900 transition-colors">AI</Link></li>
                        <li><Link to="/orderhistory" className="hover:text-white  text-gray-900 transition-colors">Order History</Link></li>
                    </ul>
                </div>

                {/* Customer Service */}
                <div>
                    <h4 className="text-lg font-semibold mb-4">Category</h4>
                    <ul className="space-y-2">
                        <li><Link to="/products/electronics" className="hover:text-white  text-gray-900 transition-colors">Electronics</Link></li>
                        <li><Link to="/products/fashion" className="hover:text-white  text-gray-900 transition-colors">Fashions</Link></li>
                        <li><Link to="/products/homeliving" className="hover:text-white  text-gray-900 transition-colors">Home & Livings</Link></li>
                        <li><Link to="/products/books" className="hover:text-white  text-gray-900 transition-colors">Books</Link></li>
                    </ul>
                </div>

                {/* Contact Info */}
                <div>
                    <h4 className="text-lg font-semibold mb-4">Contact Us</h4>
                    <p className="text-sm text-gray-900">
                        <i className="fas fa-map-marker-alt text-red-600 mr-2"></i>
                        123 Shopping Street, Surat, Gujarat, India
                    </p>
                    <p className="text-sm text-gray-900">
                        <i className="fas fa-phone text-green-600 mr-2"></i>
                        +91 1234567890
                    </p>
                    <p className="text-sm text-gray-900">
                        <i className="fas fa-envelope text-blue-600 mr-2"></i>
                        <a
                            href="https://mail.google.com/mail/?view=cm&fs=1&to=support@gomart.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-blue-800 transition-colors"
                        >
                            support@gomart.com
                        </a>
                    </p>

                </div>
            </div>

            {/* Bottom Bar */}
            <div className="max-w-6xl mx-auto px-8 py-8 border-t-2 border-zinc-300 mt-6">
                <div className='flex justify-center items-center space-x-2'>
                    <h1 className='font-outfit'>be a part of us ! apply now for job</h1>
                    <Link to='/job' className='bg-orange-600 text-white px-4 py-2 border-2 border-gray-200/40 hover:text-black rounded-full text-sm font-normal tracking-normal hover:bg-red-600 transition-colors'>Apply Now</Link>
                </div>
                <div className="flex flex-col md:flex-row justify-between mt-6 items-center">
                    <div className="flex items-center space-x-2">
                        <img
                            src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg"
                            alt="Visa"
                            className="h-6 p-1 rounded-md"
                        />
                        <img
                            src="https://upload.wikimedia.org/wikipedia/commons/a/a4/Mastercard_2019_logo.svg"
                            alt="MasterCard"
                            className="h-6 p-1 rounded-md"
                        />
                        <img
                            src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg"
                            alt="PayPal"
                            className="h-6 p-1 rounded-md"
                        />
                        <img
                            src="https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg"
                            alt="Apple Pay"
                            className="h-6 p-1 rounded-md"
                        />
                    </div>
                    <p className="text-sm text-black">
                        © {new Date().getFullYear()} GoMart. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
