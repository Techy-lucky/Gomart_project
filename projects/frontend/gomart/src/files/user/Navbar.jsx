import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import logo from "../../images/logo/final.png";
import menuIcon from "../../images/icon/menu.svg";
import closeIcon from "../../images/icon/close.svg";
import profile from "../../images/icon/user-stroke-rounded.svg";
import home from "../../images/icon/home-07-stroke-rounded.svg";
import allproducts from "../../images/icon/border-all-01-stroke-rounded.svg";
import cart from "../../images/icon/shopping-cart-add-01-stroke-rounded.svg";
import about from "../../images/icon/1st-bracket-square-stroke-rounded.svg";
import feedback from "../../images/icon/star-stroke-rounded.svg";
import search from "../../images/icon/search-01-stroke-rounded.svg";
import Setting from "../../images/icon/setting.svg";
import AI from "../../images/icon/ai-chip-stroke-rounded.svg";
import compare from "../../images/icon/git-compare-stroke-rounded.svg"

import "../../css files/navbar.css";

const Navbar = () => {
    const location = useLocation();
    const currentPath = location.pathname;
    const [menuOpen, setMenuOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 1050);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth <= 1050);
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    return (
        <nav className="bg-white/20 backdrop-blur-md shadow-lg rounded-full mx-4 mt-4 font-outfit border-2 border-gray-200/30 relative z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 flex justify-between items-center h-14">

                {/* Logo */}
                <div name="logo-section" className="flex items-center">
                    <Link to="/homepage" className="flex-shrink-0 flex items-center">
                        <img src={logo} alt="Gomart Logo" className="h-7 w-auto" />
                        <h1 className="font-outfit font-bold text-[20px] ml-0">GoMart</h1>
                    </Link>
                </div>

                {/* Desktop Navigation */}
                {!isMobile && (
                    <div name="navigation-links" className="flex space-x-2 justify-center flex-grow">
                        {[
                            { to: "/search", img: search, label: "Search" },
                            { to: "/homepage", img: home, label: "Home" },
                            { to: "/allproducts", img: allproducts, label: "All Products" },
                            { to: "/cart", img: cart, label: "Cart" },
                            { to: "/aichat", img: AI, label: "AI" },
                            { to: "/compare", img: compare, label: "Compare" },
                            { to: "/about", img: about, label: "About" },
                            { to: "/feedback", img: feedback, label: "Feedback" },
                            { to: "/profile", img: profile, label: "Profile" },
                        ].map(({ to, img, label }) => (
                            <Link
                                key={to}
                                to={to}
                                className={`text-gray-700 px-3 py-2 rounded-full text-sm font-medium flex items-center transition duration-200 hover:bg-gray-100 ${currentPath === to ? "bg-gray-100 text-gray-900" : "hover:text-gray-900"
                                    }`}
                            >
                                <img src={img} alt={label} className="w-4 h-4 mr-1.5" />
                                <span>{label}</span>
                            </Link>
                        ))}
                    </div>
                )}

                {/* Setting Icon */}
                {!isMobile && (
                    <div name="navigation-links" className="flex items-center">
                        <Link to="/setting" className={`text-gray-700 px-2 py-2 rounded-full text-sm font-medium flex items-center transition-colors duration-200 hover:no-underline ${currentPath === '/setting' ? 'bg-gray-100/90 text-gray-900' : 'hover:text-gray-900 hover:bg-gray-100/90'
                            }`}>
                            <img src={Setting} alt="setting" className="w-7 h-7" />
                        </Link>
                    </div>
                )}

                {/* Mobile Hamburger Menu */}
                {isMobile && (
                    <button className="p-2 focus:outline-none" onClick={() => setMenuOpen(!menuOpen)}>
                        <img src={menuOpen ? closeIcon : menuIcon} alt="Menu" className="w-7 h-7" />
                    </button>
                )}
            </div>

            {/* Mobile Dropdown Menu */}
            {isMobile && menuOpen && (
                <div className="absolute top-16 right-4 w-56 bg-white shadow-lg rounded-lg overflow-hidden transition-transform duration-300">
                    {[
                        { to: "/search", img: search, label: "Search" },
                        { to: "/homepage", img: home, label: "Home" },
                        { to: "/allproducts", img: allproducts, label: "All Products" },
                        { to: "/cart", img: cart, label: "Cart" },
                        { to: "/compare", img: compare, label: "Compare" },
                        { to: "/aichat", img: AI, label: "AI" },
                        { to: "/about", img: about, label: "About" },
                        { to: "/feedback", img: feedback, label: "Feedback" },
                        { to: "/profile", img: profile, label: "Profile" },
                        { to: "/setting", img: Setting, label: "Setting" },
                    ].map(({ to, img, label }) => (
                        <Link
                            key={to}
                            to={to}
                            className="flex items-center p-3 text-gray-700 hover:bg-gray-100 transition"
                            onClick={() => setMenuOpen(false)}
                        >
                            <img src={img} alt={label} className="w-5 h-5 mr-2" />
                            {label}
                        </Link>
                    ))}
                </div>
            )}
        </nav>
    );
};

export default Navbar;
