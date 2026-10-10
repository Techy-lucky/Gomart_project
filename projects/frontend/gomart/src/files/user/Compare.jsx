/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
import axios from "axios";
import { isAuthenticated } from "../../api/axios";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import '../../css files/ALLanimation.css'

const ProductComparison = () => {
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [subcategories, setSubcategories] = useState([]);
    const [filters, setFilters] = useState({
        category: "",
        subcategory: "",
    });
    const [isFiltered, setIsFiltered] = useState(false);
    const [animationComplete, setAnimationComplete] = useState(false);

    useEffect(() => {
        fetchProducts();
    }, []);

    useEffect(() => {
        if (!isAuthenticated()) {
            navigate("/");
        }
    }, [navigate]);

    const fetchProducts = async () => {
        try {
            const response = await axios.get("http://localhost:5000/products");
            if (response.data.success) {
                setProducts(response.data.products);
                extractCategoriesAndSubcategories(response.data.products);
            }
        } catch (error) {
            console.error("Error fetching products:", error);
        }
    };

    const extractCategoriesAndSubcategories = (products) => {
        const uniqueCategories = [...new Set(products.map((product) => product.category))];
        setCategories(uniqueCategories);
    };

    useEffect(() => {
        if (filters.category) {
            const filteredSubcategories = [
                ...new Set(products.filter((product) => product.category === filters.category).map((product) => product.subcategory)),
            ];
            setSubcategories(filteredSubcategories);
        } else {
            setSubcategories([]);
        }
    }, [filters.category, products]);

    const filteredProducts = products.filter((product) => {
        return (
            filters.category &&
            filters.subcategory &&
            product.category === filters.category &&
            product.subcategory === filters.subcategory
        );
    });

    const handleFilterChange = (e) => {
        setFilters({ ...filters, [e.target.name]: e.target.value });
        if (e.target.name === "subcategory" && e.target.value !== "") {
            setIsFiltered(true);
        }
    };

    const handleClearFilters = () => {
        setFilters({ category: "", subcategory: "" });
        setIsFiltered(false);
        setAnimationComplete(false);
    };

    return (
        <div className="font-outfit anime bg-white/20 mt-5 h-[83vh] border-2 border-gray-200/40 ml-4 mr-4 rounded-xl text-white flex flex-col items-center relative">
            <motion.h1
                initial={{ y: 0, opacity: 1 }}
                animate={{ y: isFiltered ? -160 : 0, opacity: 1 }}
                transition={{ type: "spring", stiffness: 500, damping: 14, duration: 0.2 }}
                className="anime  text-2xl font-bold text-black absolute top-[28vh] transform -translate-y-1/2"
            >
                Product Comparison page
            </motion.h1>

            <motion.div
                initial={{ y: 0 }}
                animate={{ y: isFiltered ? -160 : 0 }}
                transition={{ type: "spring", stiffness: 500, damping: 14, duration: 0.2 }}
                onAnimationComplete={() => setAnimationComplete(isFiltered)}
                className="anime flex gap-2 items-center bg-opacity-50 backdrop-blur-lg bg-white/10 p-3 rounded-full shadow-lg absolute top-[35vh] transform -translate-y-1/2"
            >
                <select
                    name="category"
                    className="anime px-3 py-2 bg-white/20 rounded-l-full text-black outline-none "
                    value={filters.category}
                    onChange={handleFilterChange}
                >
                    <option value="">Select Category</option>
                    {categories.map((cat) => (
                        <option key={cat} value={cat}>{cat}</option>
                    ))}
                </select>

                <select
                    name="subcategory"
                    className="anime px-3 py-2 rounded-r-full bg-white/20 text-black outline-none"
                    value={filters.subcategory}
                    onChange={handleFilterChange}
                    disabled={!filters.category}
                >
                    <option value="">Select Subcategory</option>
                    {subcategories.map((sub) => (
                        <option key={sub} value={sub}>{sub}</option>
                    ))}
                </select>

                <button
                    onClick={handleClearFilters}
                    className="anime px-4 py-2 bg-red-500 text-white rounded-full hover:bg-red-600"
                >
                    Clear
                </button>
            </motion.div>

            {animationComplete && filteredProducts.length > 0 && (
                <div className="anime mt-36 w-full max-w-3xl bg-white/10 p-4 rounded-lg shadow-lg backdrop-blur-lg overflow-y-auto max-h-[57vh] border border-white/20 
                                [&::-webkit-scrollbar]:w-2
                                [&::-webkit-scrollbar-track]:bg-transparent
                                [&::-webkit-scrollbar-thumb]:bg-gray-800/50
                                [&::-webkit-scrollbar-thumb]:rounded-full ">
                    <h2 className="anime text-2xl font-bold mb-4 text-center text-black">Comparison</h2>
                    <div className="anime grid grid-cols-2 gap-4">
                        {filteredProducts.map((product) => (
                            <div key={product.id} className="anime bg-white/20 p-4 rounded-lg text-center shadow-md backdrop-blur-md border border-white/30">
                                <img src={product.images[0].url} alt={product.name} className="anime w-full h-40 object-contain bg-white rounded-md mb-2 shadow-sm" />
                                <h3 className="anime text-lg font-semibold text-black p-2">{product.name}</h3>
                                <p className="anime text-sm font-bold text-black p-2">₹{product.price}</p>
                                <p className="anime text-sm text-justify text-black/80 p-1">{product.description}</p>
                                <p className="anime text-sm text-black/70 p-1">Brand: GoMart</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductComparison;

