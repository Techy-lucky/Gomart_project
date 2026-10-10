import { useNavigate } from 'react-router-dom';
import axios from '../../api/axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const LogoutButton = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axios.post('/logout');
      localStorage.removeItem('token');
      toast.success('Logged out successfully');
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
      localStorage.removeItem('token');
      navigate('/');
    }
  };

  return (
    <>
      <button
        onClick={handleLogout}
        className="px-14 py-2 bg-red-600 border border-gray-200/20 hover:bg-red-600 hover:border-black hover:border font-outfit text-white rounded-full font-light  hover:rounded-full  hover:text-black transition-colors duration-300 flex items-center gap-2"
      >
        Logout
      </button>
      <ToastContainer />
    </>
  );
};

export default LogoutButton;