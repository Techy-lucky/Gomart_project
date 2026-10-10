import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../../api/axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import userImg from "../../images/img/undraw_urban_design_kpu8.svg";
import Logout from '../user/LogoutButton'

import "../../css files/profile.css";

const Profile = () => {
    const [userData, setUserData] = useState({
        fullName: '', email: '', contact: '',
        profilePicture: '', isGoogleUser: false
    });
    const [imageError, setImageError] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    toast.error('Please login first');
                    navigate('/');
                    return;
                }

                const response = await axios.get('/profile', {
                    headers: { Authorization: `Bearer ${token}` }
                });

                if (response.data) {
                    const { fullName, email, contact, profilePicture, googleId } = response.data;
                    setUserData({
                        fullName: fullName || '',
                        email: email || '',
                        contact: contact || 'N/A',
                        profilePicture: profilePicture || '',
                        isGoogleUser: !!googleId
                    });
                }
            } catch (error) {
                if (error.response?.status === 401) {
                    localStorage.removeItem('token');
                    toast.error('Session expired. Please login again');
                    navigate('/login');
                } else {
                    toast.error('Failed to load profile');
                }
            }
        };
        fetchUserProfile();
    }, [navigate]);

    useEffect(() => {
        if (userData.fullName && userData.email) {
            localStorage.setItem('userFullName', userData.fullName);
            localStorage.setItem('userEmail', userData.email);
        }
    }, [userData]);

    const renderProfileImage = () => (
        !userData.profilePicture || imageError ? (
            <div className="profile-placeholder w-full h-full bg-gray-200 flex items-center justify-center">
                <span className="text-4xl font-bold text-blue-600">
                    {userData.fullName?.charAt(0).toUpperCase() || '?'}
                </span>
            </div>
        ) : (
            <img
                src={userData.profilePicture}
                alt="Profile"
                className="profile-image w-full h-full object-cover"
                onError={() => setImageError(true)}
            />
        )
    );

    // eslint-disable-next-line react/prop-types
    const ProfileField = ({ label, value, icon }) => (
        <div className="profile-field bg-white/40 p-2 min-w-1/2 rounded-lg shadow-sm border border-white/50">
            <label className="field-label text-sm text-gray-600 mb-1 flex items-center">
                <i className={`fas fa-${icon} mr-2`}></i>{label}
            </label>
            <p className="field-value text-base font-semibold text-gray-800">{value}</p>
        </div>
    );

    const handlesubmit = (e) => {
        e.preventDefault();
        navigate('/orderhistory');
    }



    return (
        <div className="profile-container font-outfit  rounded-2xl m-4 w-[97%] mx-auto">
            <div className="profile-grid grid grid-cols-1 md:grid-cols-2  gap-4 border-2 border-gray-200/40 bg-white/20 backdrop-blur-md h-[84vh] rounded-2xl shadow-xl">
                <div className="profile-left bg-blue-500 p-6 rounded-l-2xl flex flex-col items-center justify-center text-white">
                    <div className="profile-image-container w-3/4 h-2/4 mb-4">
                        <img src={userImg} alt="User" className="profile-illustration w-full h-full object-contain" />
                    </div>
                    <h1 className="profile-title text-2xl font-bold mb-1">Welcome to GoMart</h1>
                    <p className="profile-subtitle text-blue-100">User Dashboard</p>
                </div>

                <div className="profile-right p-6 ml-16 mr-16">
                    <div className="profile-header flex items-center gap-4 mb-4">
                        <div className="profile-avatar w-24 h-24 rounded-full overflow-hidden">
                            {renderProfileImage()}
                        </div>
                        <div className="profile-info">
                            <h2 className="profile-heading text-xl font-bold text-gray-800">User Profile</h2>
                            <p className="profile-subheading text-sm text-gray-600">Manage your account</p>
                        </div>
                    </div>

                    <div className="profile-fields space-y-3">
                        <ProfileField label="Full Name" value={userData.fullName} icon="user" />
                        <ProfileField label="Email" value={userData.email} icon="envelope" />
                        <ProfileField label="Phone" value={userData.contact} icon="phone" />
                        <ProfileField label="Account Type" value={userData.isGoogleUser ? "Google Account" : "Regular Account"} icon="user-shield" />
                    </div>

                    <div className="profile-actions flex flex-wrap gap-2 justify-center mt-4">
                        <Logout />
                        <button className="order-history-btn px-8 py-3 font-outfit hover:rounded-full font-light bg-orange-600 hover:text-black text-white rounded-full item-center" onClick={handlesubmit}>
                            Order History
                        </button>
                    </div>
                </div>
            </div>
            <ToastContainer />
        </div>
    );
};

export default Profile;
