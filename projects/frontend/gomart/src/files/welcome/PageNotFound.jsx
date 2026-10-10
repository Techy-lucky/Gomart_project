import { useNavigate } from 'react-router-dom'
import '../../css files/ALLanimation.css'

function PageNotFound() {
  const navigate = useNavigate();

  const handleHomeClick = () => {
    const token = localStorage.getItem('token');
    if (token) {
      navigate(-1);
    } else {
      navigate('/');
    }
  };

  return (
    <div className="anime font-outfit min-h-screen flex items-center justify-center">
      <div className="text-center border-2 border-gray-400/20 space-y-6 backdrop-blur-md bg-white/10 p-12 rounded-xl shadow-lg">
        <h1 className="text-9xl font-bold text-gray-800">404</h1>
        <h2 className="text-3xl font-semibold text-gray-900">Page Not Found</h2>
        <p className="text-gray-800 max-w-md">
          Oops! The page you are looking for might have been removed or is temporarily unavailable.
        </p>
        <button
          onClick={handleHomeClick}
          className="inline-block px-5 py-3 bg-black border border-black text-white rounded-full hover:bg-white hover:text-black transition-colors"
        >
          Return Home
        </button>
      </div>
    </div>
  )
}

export default PageNotFound