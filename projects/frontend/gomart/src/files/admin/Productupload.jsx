import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../../api/axios';
import '../../css files/admproductupload.css';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Productupload = () => {
  const [formData, setFormData] = useState({
    category: '',
    subcategory: '',
    name: '',
    description: '',
    price: '',
    stock: '',
    images: []
  });

  const [newCategory, setNewCategory] = useState('');
  const [newSubcategory, setNewSubcategory] = useState('');
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();


  useEffect(() => {
    const fetchAdminProfile = async () => {
      try {
        await axios.get('http://localhost:5000/admin/profile', { withCredentials: true });
      } catch (error) {
        console.error('Failed to fetch admin profile:', error);
        toast.error('Session expired. Redirecting to login...');
        navigate('/adminlogin');
      }
    };
    fetchAdminProfile();
  }, [navigate]);

  // Load categories from localStorage on component mount
  useEffect(() => {
    const savedCategories = localStorage.getItem('categories');
    const savedSubcategories = localStorage.getItem('subcategories');

    if (savedCategories) {
      setCategories(JSON.parse(savedCategories));
    } else {
      // Set default categories if none exist
      const defaultCategories = ['Electronics', 'Fashion', 'Home & Living', 'Beauty'];
      setCategories(defaultCategories);
      localStorage.setItem('categories', JSON.stringify(defaultCategories));
    }

    if (savedSubcategories) {
      setSubcategories(JSON.parse(savedSubcategories));
    } else {
      // Set default subcategories if none exist
      const defaultSubcategories = ['Smartphones', 'Laptops', 'Accessories'];
      setSubcategories(defaultSubcategories);
      localStorage.setItem('subcategories', JSON.stringify(defaultSubcategories));
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setFormData(prevState => ({
      ...prevState,
      images: files
    }));
    setSelectedFiles(files.map(file => file.name));
  };

  const handleAddCategory = (e) => {
    e.preventDefault();
    if (newCategory.trim()) {
      const updatedCategories = [...categories, newCategory.trim()];
      setCategories(updatedCategories);
      localStorage.setItem('categories', JSON.stringify(updatedCategories));
      setNewCategory('');
    }
  };

  const handleAddSubcategory = (e) => {
    e.preventDefault();
    if (newSubcategory.trim()) {
      const updatedSubcategories = [...subcategories, newSubcategory.trim()];
      setSubcategories(updatedSubcategories);
      localStorage.setItem('subcategories', JSON.stringify(updatedSubcategories));
      setNewSubcategory('');
    }
  };

  const handleRemoveCategory = (categoryToRemove) => {
    const updatedCategories = categories.filter(category => category !== categoryToRemove);
    setCategories(updatedCategories);
    localStorage.setItem('categories', JSON.stringify(updatedCategories));
  };

  const handleRemoveSubcategory = (subcategoryToRemove) => {
    const updatedSubcategories = subcategories.filter(subcategory => subcategory !== subcategoryToRemove);
    setSubcategories(updatedSubcategories);
    localStorage.setItem('subcategories', JSON.stringify(updatedSubcategories));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const formDataToSend = new FormData();
      Object.keys(formData).forEach((key) => {
        if (key === 'images') {
          formData.images.forEach((image) => formDataToSend.append('images', image));
        } else {
          formDataToSend.append(key, formData[key]);
        }
      });

      await axios.post('/admin/products/upload', formDataToSend, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      toast.success('Product uploaded successfully!');

      // Reset form
      setFormData({
        category: '',
        subcategory: '',
        name: '',
        description: '',
        price: '',
        stock: '',
        images: []
      });
      setSelectedFiles([]);

    } catch (error) {
      console.error('Error uploading product:', error);
      toast.error('Failed to upload product. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="productupload-container-outer font-outfit p-4 mt-5 w-[96%] ml-5 h-full rounded-3xl bg-white/20 backdrop-blur-lg">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="productupload-container-inner w-full mx-auto bg-zinc-200/95 rounded-3xl p-6 h-[90vh]">
        <h2 className="productupload-title text-2xl font-light text-gray-800 mb-2 text-center">Add New Product</h2>

        <form onSubmit={handleSubmit} className="productupload-form space-y-3">
          <div className="productupload-grid grid grid-cols-2 gap-4">
            {/* Left Column */}
            <div className="productupload-left-column space-y-3">
              <div className="productupload-category-management">
                <label className="productupload-label block text-gray-700 font-medium mb-1">Category Management</label>
                <div className="productupload-input-group flex gap-2 mb-1">
                  <input
                    type="text"
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="productupload-input flex-1 p-1 placeholder: text-left rounded-xl bg-white/50 border border-black/30"
                    placeholder="Add new category"
                  />
                  <button
                    onClick={handleAddCategory}
                    className="productupload-add-btn px-4 py-2 bg-green-500 text-white rounded-xl hover:bg-green-600"
                  >
                    Add
                  </button>
                </div>
                <div className="productupload-category-list flex flex-nowrap gap-2 mb-1 overflow-x-auto pb-1 [&::-webkit-scrollbar]:h-1
                                [&::-webkit-scrollbar-track]:bg-transparent
                                [&::-webkit-scrollbar-thumb]:bg-gray-800/50
                                [&::-webkit-scrollbar-thumb]:rounded-full">
                  {categories.map((category, index) => (
                    <div key={index} className="productupload-category-item flex-shrink-0 flex items-center bg-gray-200 rounded-lg px-2 py-1 text-sm">
                      <span className="productupload-category-text">{category}</span>
                      <button
                        onClick={() => handleRemoveCategory(category)}
                        className="productupload-remove-btn ml-1 text-red-500 hover:text-red-700"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="productupload-select w-full p-2 rounded-xl bg-white/50 border border-black/30 custom-scrollbar"
                  required
                >
                  <option value="">Select Category</option>
                  {categories.map((category, index) => (
                    <option key={index} value={category.toLowerCase()}>{category}</option>
                  ))}
                </select>
              </div>

              <div className="productupload-subcategory-management">
                <label className="productupload-label block text-gray-700 font-medium mb-1">Subcategory Management</label>
                <div className="productupload-input-group flex gap-2 mb-1">
                  <input
                    type="text"
                    value={newSubcategory}
                    onChange={(e) => setNewSubcategory(e.target.value)}
                    className="productupload-input flex-1 p-1 placeholder:text-center rounded-xl bg-white/50 border border-black/30"
                    placeholder="Add new subcategory"
                  />
                  <button
                    onClick={handleAddSubcategory}
                    className="productupload-add-btn px-4 py-2 bg-green-500 text-white rounded-xl hover:bg-green-600"
                  >
                    Add
                  </button>
                </div>
                <div className="productupload-subcategory-list flex flex-nowrap gap-2 mb-1 overflow-x-auto pb-1 [&::-webkit-scrollbar]:h-1
                                [&::-webkit-scrollbar-track]:bg-transparent
                                [&::-webkit-scrollbar-thumb]:bg-gray-800/50
                                [&::-webkit-scrollbar-thumb]:rounded-full">
                  {subcategories.map((subcategory, index) => (
                    <div key={index} className="productupload-subcategory-item flex-shrink-0 flex items-center bg-gray-200 rounded-lg px-2 py-1 text-sm">
                      <span className="productupload-subcategory-text">{subcategory}</span>
                      <button
                        onClick={() => handleRemoveSubcategory(subcategory)}
                        className="productupload-remove-btn ml-1 text-red-500 hover:text-red-700"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
                <select
                  name="subcategory"
                  value={formData.subcategory}
                  onChange={handleChange}
                  className="productupload-select w-full p-2 rounded-xl bg-white/50 border border-black/30 custom-scrollbar"
                  required
                >
                  <option value="">Select Sub Category</option>
                  {subcategories.map((subcategory, index) => (
                    <option key={index} value={subcategory.toLowerCase()}>{subcategory}</option>
                  ))}
                </select>
              </div>

              <div className="productupload-product-name">
                <label className="productupload-label block text-gray-700 font-medium mb-1">Product Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="productupload-input w-full p-2 rounded-xl bg-white/50 border border-black/30"
                  placeholder="Enter product name"
                  required
                />
              </div>
              <div className="productupload-price-stock grid grid-cols-2 gap-2">
                <div className="productupload-price">
                  <label className="productupload-label block text-gray-700 font-medium mb-1">Price</label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    className="productupload-input w-full p-2 rounded-xl bg-white/50 border border-black/30"
                    required
                  />
                </div>
                <div className="productupload-stock">
                  <label className="productupload-label block text-gray-700 font-medium mb-1">Stock Quantity</label>
                  <input
                    type="text"
                    name="stock"
                    value={formData.stock}
                    onChange={handleChange}
                    className="productupload-input w-full p-2 rounded-xl bg-white/50 border border-black/30"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="productupload-right-column space-y-4">
              <div className="productupload-description">
                <label className="productupload-label block text-gray-700 font-medium mb-1">Product Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="4"
                  className="productupload-textarea w-full p-3 rounded-xl bg-white/50 border border-black/30 custom-scrollbar-vertical"
                  required
                />
              </div>

              <div className="productupload-images">
                <label className="productupload-label block text-gray-700 font-medium mb-1">Product Images</label>
                <div className="productupload-image-upload flex items-center justify-center w-full">
                  <label className="productupload-upload-label flex flex-col w-full h-40 border-2 border-dashed border-gray-400 rounded-xl hover:bg-gray-100/50 cursor-pointer">
                    <div className="productupload-upload-content flex flex-col items-center justify-center h-full">
                      <svg className="productupload-upload-icon w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <p className="productupload-upload-text mt-1 text-sm text-gray-500">Select product images</p>
                    </div>
                    <input type="file" className="productupload-file-input opacity-0" accept="image/*" multiple onChange={handleImageChange} required />
                  </label>
                </div>
                {selectedFiles.length > 0 && (
                  <div className="productupload-selected-files mt-1 overflow-x-auto custom-scrollbar">
                    <p className="productupload-files-text text-sm text-gray-600">Selected files:</p>
                    <div className="productupload-files-list flex flex-nowrap gap-2 ">
                      {selectedFiles.map((fileName, index) => (
                        <div key={index} className="productupload-file-item flex-shrink-0 text-sm text-gray-500 bg-gray-200 rounded-lg px-2 py-1">
                          {fileName}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className={`productupload-submit w-[430px] py-3 px-4 text-white rounded-xl font-medium ${isSubmitting
                    ? 'bg-green-400 cursor-not-allowed'
                    : 'bg-green-500 hover:bg-green-600'
                  }`}
              >
                {isSubmitting ? 'Uploading...' : 'Upload Product'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Productupload;