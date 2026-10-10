import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import adminlogo1 from "../../images/img/admin__11_-removebg-preview.png";
import '../../css files/Admin.css';

const Adminregist = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    adminId: "",
    fname: "",
    lname: "",
    email: "",
    phone: "",
    password: "",
    cpassword: "",
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

    const { adminId, fname, lname, email, phone, password, cpassword, secretKey } = formData;

    // Check if fields are empty
    if (!adminId) {
      toast.error("Admin ID is mandatory.");
      return;
    }

    if (!fname || !lname) {
      toast.error("Full name is mandatory.");
      return;
    }

    if (!email || !phone) {
      toast.error("Contact details are mandatory.");
      return;
    }

    if (!password || !cpassword) {
      toast.error("Password fields are mandatory.");
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

    // Name validation
    const namePattern = /^[A-Za-z]+$/;
    if (!namePattern.test(fname) || !namePattern.test(lname)) {
      toast.error("Name must contain only alphabets.");
      return;
    }

    // Email validation
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    if (!emailPattern.test(email)) {
      toast.error("Please enter a valid email address.");
      return;
    }

    // Mobile validation
    const phonePattern = /^[0-9]{10}$/;
    if (!phonePattern.test(phone)) {
      toast.error("Please enter a valid 10-digit mobile number.");
      return;
    }

    // Password validation
    const passwordPattern = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
    if (!passwordPattern.test(password)) {
      toast.error("Password must be at least 8 characters with letters, numbers and special characters.");
      return;
    }

    if (password !== cpassword) {
      toast.error("Passwords do not match.");
      return;
    }

    // Secret Key validation
    const correctSecretKey = "APL@admin#123"; // In real app, this would be securely stored
    if (secretKey !== correctSecretKey) {
      toast.error("Invalid Admin Secret Key.");
      return;
    }

    // If validation passes
    try {
      const response = await fetch('http://localhost:5000/admin/register', {
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
        }, 2000);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error('Registration error:', error);
      toast.error('Registration failed. Please try again.');
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
      <div className="font-outfit min-h-screen flex items-center justify-center admin-container p-4">
        <button
          onClick={() => navigate('/unknown')}
          className="back-button absolute top-4 left-4 text-black  font-outfit flex items-center px-5 py-2 rounded-sm border border-black hover:text-white hover:bg-blue-500 bg-white/30 backdrop-blur-sm transition-all duration-300"
        >
          {/* <i className="fas fa-arrow-left mr-2"></i> */}
          Back
        </button>

        <div className="w-full max-w-6xl bg-white/20 admin-card rounded-2xl overflow-hidden flex flex-col md:flex-row">
          <div className="w-full md:w-1/2 admin-image-section p-8 flex flex-col justify-center items-center text-white">
            <img
              src={adminlogo1}
              alt="Admin Portal"
              className="admin-image w-3/4 mb-8"
            />
            <h1 className="text-3xl font-bold mb-4">Admin Registration</h1>
            <p className="text-center text-blue-100">Join our administrative team</p>
          </div>

          <div className="w-full md:w-1/2 admin-form-section p-8">
            <form onSubmit={validateForm} className="space-y-4 max-w-md mx-auto">
              <h2 className="text-2xl flex justify-center font-bold text-gray-800 mb-6">Create Admin Account</h2>

              <div className="grid grid-cols-2 gap-4">
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
                  <label className="text-sm font-medium text-gray-700 mb-1 block">Secret Key</label>
                  <div className="relative">
                    <i className="fas fa-key absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
                    <input
                      type="password"
                      name="secretKey"
                      value={formData.secretKey}
                      onChange={handleChange}
                      placeholder="Admin Secret Key"
                      className="admin-input outline-none w-full pl-10 pr-3 py-2 rounded-lg"
                    />
                  </div>
                </div>

                <div className="relative">
                  <i className="fas fa-user absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
                  <input
                    type="text"
                    name="fname"
                    value={formData.fname}
                    onChange={handleChange}
                    placeholder="First Name"
                    className="w-full pl-10 pr-3 py-1.5 border rounded-lg focus:outline-none text-sm"
                  />
                </div>

                <div className="relative">
                  <i className="fas fa-user absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
                  <input
                    type="text"
                    name="lname"
                    value={formData.lname}
                    onChange={handleChange}
                    placeholder="Last Name"
                    className="w-full pl-10 pr-3 py-1.5 border rounded-lg focus:outline-none text-sm"
                  />
                </div>
              </div>

              <div className="relative">
                <i className="fas fa-envelope absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Email Address"
                  className="w-full pl-10 pr-3 py-1.5 border rounded-lg focus:outline-none text-sm"
                />
              </div>

              <div className="relative">
                <i className="fas fa-phone absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Phone Number"
                  className="w-full pl-10 pr-3 py-1.5 border rounded-lg focus:outline-none text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="relative">
                  <i className="fas fa-lock absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Password"
                    className="w-full pl-10 pr-3 py-1.5 border rounded-lg focus:outline-none text-sm"
                  />
                </div>

                <div className="relative">
                  <i className="fas fa-lock absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
                  <input
                    type="password"
                    name="cpassword"
                    value={formData.cpassword}
                    onChange={handleChange}
                    placeholder="Confirm Password"
                    className="w-full pl-10 pr-3 py-1.5 border rounded-lg focus:outline-none text-sm"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="admin-button w-full py-3 text-white rounded-lg font-semibold mt-6"
              >
                Create Admin Account
              </button>

              <div className="text-center">
                <p className="text-gray-600">
                  Already registered?{' '}
                  <Link to="/adminlogin" className="text-indigo-600 hover:text-indigo-700 font-semibold">
                    Login here
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </div>
        <ToastContainer position="top-right" autoClose={3000} />
      </div>
    </>
  );
};

export default Adminregist;