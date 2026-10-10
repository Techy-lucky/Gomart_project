import { useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { isAuthenticated } from '../../api/axios'
import '../../css files/search.css'

const useDebounce = (callback, delay) => {
  const [timeoutId, setTimeoutId] = useState(null);

  return useCallback(
    (...args) => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      setTimeoutId(
        setTimeout(() => {
          callback(...args);
        }, delay)
      );
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [callback, delay]
  );
};

const Search = () => {
  const [query, setQuery] = useState("");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const searchProducts = async (searchQuery) => {
    if (!searchQuery.trim()) {
      setProducts([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(
        `http://localhost:5000/search?query=${searchQuery}`
      );
      if (response.data.success) {
        setProducts(response.data.products);
      }
    } catch (error) {
      console.error("Search error:", error);
      setError("Failed to fetch products");
    } finally {
      setLoading(false);
    }
  };

  const debouncedSearch = useDebounce(searchProducts, 300);

  useEffect(() => {
    debouncedSearch(query);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/');
    }
  }, [navigate]);


  return (
    <div className="font-outfit search-container bg-white/20 backdrop-blur-md border-2 border-gray-200/40 rounded-xl w-[97%] h-[83vh] mx-auto mt-5 p-6">
      <div className={`search-form ${!products.length && 'search-form--centered'}`}>
        <div className="search-form__top">
          <div className={`search-controls ${products.length ? 'search-controls--expanded' : ''}`}>
            <div className="sticky top-0 z-10 mb-1">
              <div className="relative mx-auto w-[400px]">
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search products..."
                  className="w-full pl-12 pr-4 py-3.5 rounded-full 
                         bg-white/30 backdrop-blur-sm
                         border-2 border-white/20
                         focus:outline-none focus:border-white/40
                         shadow-lg hover:shadow-xl
                         transition-all duration-300
                         placeholder-zinc-900"
                />
                <i className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-900">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className="w-5 h-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                    />
                  </svg>
                </i>
                {loading && (
                  <div className="absolute right-4 top-1/2 -translate-y-1/2">
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white/40 border-t-transparent"></div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className={`search-filters ${products.length ? 'search-filters--visible' : 'search-filters--hidden'}`}>
            {/* Keep existing filter section */}
          </div>
        </div>

        {products.length > 0 && (
          <div className="search-results">
            <div className="h-[410px] overflow-y-auto scroll-smooth 
             rounded-lg p-5 
            [&::-webkit-scrollbar]:w-2
            [&::-webkit-scrollbar-track]:bg-transparent 
            [&::-webkit-scrollbar-thumb]:bg-gray-400/50
            [&::-webkit-scrollbar-thumb]:rounded-full
            dark:[&::-webkit-scrollbar-thumb]:bg-gray-600/50
            hover:[&::-webkit-scrollbar-thumb]:bg-gray-400
            dark:hover:[&::-webkit-scrollbar-thumb]:bg-gray-600">
              {error ? (
                <div className="text-center py-8 text-red-400 backdrop-blur-md rounded-lg">
                  {error}
                </div>
              ) : (
                <table className="w-full bg-white/50 rounded-xl text-left">
                  <thead>
                    <tr className="text-sm font-medium text-gray-700 border-b">
                      <th className="p-4">Image</th>
                      <th className="p-4">Name</th>
                      <th className="p-4">Category</th>
                      <th className="p-4">Subcategory</th>
                      <th className="p-4">Price</th>
                      <th className="p-4">View</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((product) => (
                      <tr key={product.id} className="hover:bg-white/30">
                        <td className="p-4">
                          <img
                            src={product.images[0]?.url}
                            alt={product.name}
                            className="w-16 h-16 object-cover rounded-lg"
                          />
                        </td>
                        <td className="p-4">{product.name}</td>
                        <td className="p-4">{product.category}</td>
                        <td className="p-4">{product.subcategory}</td>
                        <td className="p-4">₹{product.price}</td>
                        <td className="p-4">
                          <Link
                            to={`/product/${product.id}`}
                            className="text-blue-600 hover:text-blue-400 transition-colors duration-300"
                          >
                            View
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}

              {query && !loading && products.length === 0 && (
                <div className="text-center py-12 px-4">
                  <p className="text-xl text-gray-800">
                    No products found matching &quot;{query}&quot;
                  </p>
                  <p className="text-sm text-gray-700 mt-2">
                    Try searching with different keywords
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Search;
