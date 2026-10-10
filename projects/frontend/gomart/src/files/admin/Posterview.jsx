import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import '../../css files/ALLanimation.css'

function Posterview() {
  const [posters, setPosters] = useState([]);
  const [error, setError] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    fetchPosters();
  }, []);

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

  const fetchPosters = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/posters');
      const data = await response.json();
      setPosters(data);
    } catch{
      setError('Error fetching posters');
      toast.error('Failed to load posters');
    }
  };

  const handleDelete = async (posterId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/posters/${posterId}`, {
        method: 'DELETE',
        credentials: 'include'
      });

      if (response.ok) {
        setPosters(posters.filter(poster => poster.id !== posterId));
        toast.success('Poster deleted successfully');
      } else {
        toast.error('Failed to delete poster');
      }
    } catch{
      toast.error('Error deleting poster');
    }
  };

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % posters.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? posters.length - 1 : prevIndex - 1
    );
  };

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-red-500 text-xl font-semibold">{error}</div>
      </div>
    );
  }

  return (
    <div className="posterupload-container-outer font-outfit p-4 mt-5 w-[97%] h-[94vh] mx-auto rounded-3xl bg-white/20 backdrop-blur-lg overflow-hidden">
      <div className="posterupload-container-inner w-full h-full mx-auto bg-zinc-200/95 rounded-3xl p-8 font-outfit ">
        <h2 className="anime text-2xl font-light text-gray-800 mb-6 text-center">Uploaded Posters</h2>
        
        <ToastContainer position="top-right" autoClose={3000} />

        {/* Featured Poster View */}
        {posters.length > 0 && (
          <div className="anime featured-poster-container relative h-[250px] mb-4 bg-white/50 rounded-xl p-2">
            <button 
              className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full z-10 transition-all"
              onClick={prevSlide}
            >
              &#10094;
            </button>

            <div className="relative h-full">
              <img
                src={posters[currentIndex].imageUrl}
                alt={posters[currentIndex].name}
                className="w-[80%] h-[75%] mx-auto object-contain rounded-lg"
              />
              
              <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white p-3 rounded-b-lg">
                <h3 className="text-xl font-semibold">{posters[currentIndex].name}</h3>
              </div>
            </div>

            <button 
              className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full z-10 transition-all"
              onClick={nextSlide}
            >
              &#10095;
            </button>
          </div>
        )}

        {/* Posters Table */}
        <div className="anime posters-table-container h-[calc(100%-320px)] overflow-y-auto [&::-webkit-scrollbar]:w-2
      [&::-webkit-scrollbar-track]:bg-transparent 
      [&::-webkit-scrollbar-thumb]:bg-gray-400/50
      [&::-webkit-scrollbar-thumb]:rounded-full
      dark:[&::-webkit-scrollbar-thumb]:bg-gray-600/50
      hover:[&::-webkit-scrollbar-thumb]:bg-gray-400
      dark:hover:[&::-webkit-scrollbar-thumb]:bg-gray-600 px-2">
          <table className="anime w-full bg-white/50 rounded-lg">
            <thead className="anime sticky top-0 bg-white rounded-lg backdrop-blur-sm z-10">
              <tr className="text-left border-b">
                <th className="p-4">Name</th>
                <th className="p-4">Upload Date</th>
                <th className="p-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {posters.map((poster) => (
                <tr key={poster.id} className="hover:bg-white/30 transition-colors">
                  <td className="p-4">{poster.name}</td>
                  <td className="p-4">
                    {new Date(poster.uploadDate).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </td>
                  <td className="p-4">
                    <button
                      onClick={() => handleDelete(poster.id)}
                      className="bg-red-500 text-white px-3 py-1 rounded-full hover:bg-red-600 transition-colors text-sm"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {posters.length === 0 && !error && (
          <div className="text-center text-gray-500 mt-8">
            <p className="text-lg">No posters uploaded yet</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Posterview;