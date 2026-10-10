import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import adminlogo1 from "../../images/img/admin__13_-removebg-preview.png";
import '../../css files/Admin.css';

const Adminlogin = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    adminId: "",
    password: "",
    secretKey: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = async (e) => {
    e.preventDefault();

    const { adminId, password, secretKey } = formData;

    // Check if fields are empty
    if (!adminId) {
      toast.error("Admin ID is mandatory.");
      return;
    }

    if (!password) {
      toast.error("Password is mandatory.");
      return;
    }

    if (!secretKey) {
      toast.error("Admin Secret Key is mandatory.");
      return;
    }

    // Admin ID validation
    const adminIdPattern = /^ADM-\d{4}$/;
    if (!adminIdPattern.test(adminId)) {
      toast.error("Admin ID must be in format: ADM-XXXX");
      return;
    }

    // Password validation
    const passwordPattern = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
    if (!passwordPattern.test(password)) {
      toast.error("Invalid password format.");
      return;
    }

    // Secret Key validation
    const correctSecretKey = "APL@admin#123"; // In real app, this would be securely stored
    if (secretKey !== correctSecretKey) {
      toast.error("Invalid Admin Secret Key.");
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
        credentials: 'include'
      });

      const data = await response.json();

      if (data.success) {
        toast.success(data.message);
        setTimeout(() => {
          navigate("/admindashboard");
        }, 500);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Login failed. Please try again.');
    }
  };

  return (
    <>
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css"
        integrity="sha512-9usAa10IRO0HhonpyAIVpjrylPvoDwiPUiKdWk5t3PyolY1cOd4DSE0Ga+ri4AuTroPR5aQvXU9xC6qOPnzFeg=="
        crossOrigin="anonymous"
        referrerPolicy="no-referrer"
      />
      <div className="min-h-screen flex items-center justify-center admin-container p-4">
        <button
          onClick={() => navigate('/unknown')}
          className="back-button absolute top-4 left-4 text-black  font-outfit flex items-center px-5 py-2 rounded-sm border-2 border-gray-400/40 hover:text-white hover:bg-blue-500 bg-white/30 backdrop-blur-sm transition-all duration-300"
        >
          {/* <i className="fas fa-arrow-left mr-2"></i> */}
          Back
        </button>

        <div className="w-full max-w-5xl bg-white/20 admin-card rounded-2xl overflow-hidden flex flex-col md:flex-row">
          <div className="w-full md:w-1/2 admin-image-section p-8 flex flex-col justify-center items-center text-white">
            <img
              src={adminlogo1}
              alt="Admin Portal"
              className="admin-image w-3/4 mb-8"
            />
            <h1 className="text-3xl font-bold mb-4">Welcome Back, Admin</h1>
            <p className="text-center text-blue-100">Access your administrative dashboard securely</p>
          </div>

          <div className="w-full md:w-1/2 admin-form-section p-8">
            <form onSubmit={validateForm} className="space-y-6 max-w-md mx-auto">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Admin Login</h2>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">Admin ID</label>
                  <div className="relative">
                    <i className="fas fa-id-card absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
                    <input
                      type="text"
                      name="adminId"
                      value={formData.adminId}
                      onChange={handleChange}
                      placeholder="ADM-XXXX"
                      className="admin-input outline-none w-full pl-10 pr-3 py-2 rounded-lg"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">Password</label>
                  <div className="relative">
                    <i className="fas fa-lock absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="••••••••"
                      className="admin-input outline-none w-full pl-10 pr-3 py-2 rounded-lg"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">Secret Key</label>
                  <div className="relative">
                    <i className="fas fa-key absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
                    <input
                      type="password"
                      name="secretKey"
                      value={formData.secretKey}
                      onChange={handleChange}
                      placeholder="Enter admin secret key"
                      className="admin-input outline-none w-full pl-10 pr-3 py-2 rounded-lg"
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="admin-button w-full py-3 text-white rounded-lg font-semibold"
              >
                Login as Admin
              </button>

              <div className="text-center">
                <p className="text-gray-600">
                  Not registered yet?{' '}
                  <Link to="/adminregister" className="text-indigo-600 hover:text-indigo-700 font-semibold">
                    Create Account
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </div>
        <ToastContainer position="top-right" autoClose={3000} />

        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </div>
    </>
  );
};

export default Adminlogin;
