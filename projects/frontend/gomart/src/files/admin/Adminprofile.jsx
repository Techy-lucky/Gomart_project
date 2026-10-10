import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types'; // ✅ Added for prop validation
import axios from 'axios';
import adimg from "../../images/img/admin__2_-removebg-preview.png";
import "../../css files/adminprofile.css";
import { toast, ToastContainer } from 'react-toastify';

function Adminprofile() {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [imageError, setImageError] = useState(false); // ✅ Fixed undefined `imageError`
  const navigate = useNavigate();

  const renderProfileImage = () => {
    if (!admin || !admin.profilePicture || imageError) {
      return (
        <div className="profile-placeholder w-full h-full bg-gray-200 flex items-center justify-center">
          <span className="text-4xl font-bold text-blue-600">
            {admin?.fname?.charAt(0).toUpperCase() || '?'}
            {admin?.lname?.charAt(0).toUpperCase() || '?'}
          </span>
        </div>
      );
    }
    return (
      <img
        src={admin.profilePicture}
        alt="Admin"
        className="w-full h-full object-cover"
        onError={() => setImageError(true)}
      />
    );
  };

  useEffect(() => {
    const fetchAdminProfile = async () => {
      try {
        const response = await axios.get('http://localhost:5000/admin/profile', {
          withCredentials: true
        });
        setAdmin(response.data);
      } catch {
        toast.error('Admin session expired. Redirecting to login...');
        navigate('/adminlogin');
      } finally {
        setLoading(false);
      }
    };
    fetchAdminProfile();
  }, [navigate]); // ✅ Removed `error` dependency to prevent infinite re-renders

  if (loading) return <div className="text-center p-3">Loading...</div>;
  if (!admin) return <div className="text-center p-3">No admin data found</div>;

  return (
    <div className="admin-profile-container font-outfit w-full h-screen p-5 rounded-2xl">
      <div className="admin-profile-grid grid grid-cols-1 md:grid-cols-2 gap-4 bg-white/20 backdrop-blur-md rounded-2xl shadow-xl h-full">
        {/* Left Section */}
        <div className="admin-profile-left bg-blue-600 p-6 rounded-l-2xl flex flex-col items-center justify-center text-white">
          <div className="admin-image-container w-3/4 h-3/4 mb-4">
            <img src={adimg} alt="Admin" className="admin-illustration w-full h-full object-contain" />
          </div>
          <h1 className="admin-title text-2xl font-bold mb-1">Welcome to GoMart</h1>
          <p className="admin-subtitle text-blue-100">Admin Dashboard</p>
        </div>

        {/* Right Section */}
        <div className="admin-profile-right p-6">
          <div className="admin-profile-header flex items-center gap-4 mb-4">
            <div className="admin-avatar w-24 h-24 rounded-full overflow-hidden">
              {renderProfileImage()}
            </div>
            <div className="admin-info">
              <h2 className="admin-heading text-xl font-bold text-gray-800">Admin Profile</h2>
              <p className="admin-subheading text-sm text-gray-600">Manage your account</p>
              <p className="admin-name text-base font-semibold text-gray-800">{admin.fname} {admin.lname}</p>
            </div>
          </div>

          <div className="admin-profile-fields space-y-3">
            <ProfileField label="Admin ID" value={admin.adminId} icon="id-badge" />
            <ProfileField label="First Name" value={admin.fname} icon="user" />
            <ProfileField label="Last Name" value={admin.lname} icon="user" />
            <ProfileField label="Email" value={admin.email} icon="envelope" />
            <ProfileField label="Phone" value={admin.phone} icon="phone" />
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}

// ✅ Added PropTypes validation
const ProfileField = ({ label, value, icon }) => (
  <div className="profile-field bg-white/40 p-3 rounded-lg shadow-sm border border-white/50">
    <label className="field-label text-sm text-gray-600 mb-1 flex items-center">
      <i className={`fas fa-${icon} mr-2`}></i>
      {label}
    </label>
    <p className="field-value text-base font-semibold text-gray-800">{value}</p>
  </div>
);

ProfileField.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  icon: PropTypes.string.isRequired
};

export default Adminprofile;
