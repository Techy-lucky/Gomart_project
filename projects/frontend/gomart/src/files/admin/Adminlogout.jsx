import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from '../../api/axios';

function AdminLogout() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const response = await axios.post('/admin/logout');
      if (response.data.success) {
        toast.success('Logged out successfully');
        setTimeout(() => {
          navigate('/adminlogin');
        }, 1000);
      }
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Logout failed');
    }
  };

  return (
    <button
      onClick={handleLogout}
      className=" text-white bg-red-600 px-10 py-3 hover:text-black rounded-full  hover:rounded-full text-sm font-medium flex items-center transition-colors font-outfit duration-10"
    >
      <span>Logout</span>
    </button>
  );
}

export default AdminLogout;
