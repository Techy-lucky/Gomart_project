import { useState,useEffect } from 'react'
import '../../css files/posterupload.css'
import axios from '../../api/axios';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function PosterUpload() {
  const [selectedFile, setSelectedFile] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAdminProfile = async () => {
      try {
        await axios.get('http://localhost:5000/admin/profile', { withCredentials: true });
      } catch {
        toast.error('Admin session expired. Redirecting to login...');
        navigate('/adminlogin');
      }
    };
    fetchAdminProfile();
  }, [navigate]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.size <= 2 * 1024 * 1024) { // 2MB check
      setSelectedFile(file);
    } else {
      toast.error('File size should be less than 2MB');
      setSelectedFile(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append('image', selectedFile);

    try {
      const response = await fetch('http://localhost:5000/api/posters/upload', {
        method: 'POST',
        body: formData,
        credentials: 'include'
      });

      const data = await response.json();
      if (response.ok) {
        toast.success('Poster uploaded successfully!');
        setSelectedFile(null);
      } else {
        toast.error(data.message || 'Upload failed');
      }
    } catch{
      toast.error('Error uploading poster');
    }
  };

  return (
    <div className="posterupload-container-outer p-4 mt-5 w-[96%] ml-5 h-full rounded-3xl bg-white/20 backdrop-blur-lg">
      <div className="posterupload-container-inner w-full mx-auto bg-zinc-200/95 rounded-3xl p-8 h-[90vh] font-outfit">
        <h2 className="posterupload-title text-2xl font-light text-gray-800 mb-8 text-center">Upload Poster</h2>
        
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

        <form onSubmit={handleSubmit} className="posterupload-form max-w-4xl mx-auto">
          <div className="posterupload-upload-section mb-8">
            <label className="block text-gray-700 font-medium mb-4">Select Poster Image</label>
            <div className="posterupload-dropzone flex items-center justify-center w-full">
              <label className="flex flex-col w-full h-80 border-2 border-dashed border-gray-400 rounded-xl hover:bg-gray-100/50 cursor-pointer">
                <div className="flex flex-col items-center justify-center h-full">
                  <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <p className="mt-4 text-sm text-gray-500">
                    {selectedFile ? selectedFile.name : "Click to select poster image"}
                  </p>
                </div>
                <input 
                  type="file" 
                  className="opacity-0" 
                  accept="image/*"
                  onChange={handleFileChange}
                  required
                />
              </label>
            </div>
          </div>

          <div className="posterupload-submit flex justify-center">
            <button
              type="submit"
              className="px-8 py-3 bg-green-500 text-white font-medium rounded-xl hover:bg-green-600 transition-colors duration-200"
            >
              Upload Poster
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default PosterUpload