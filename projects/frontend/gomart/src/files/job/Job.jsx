import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import { isAuthenticated } from '../../api/axios'
import { useNavigate } from 'react-router-dom';

function Job() {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        contact: '',
        age: '',
        gender: '',
        address: '',
        city: '',
        pincode: '',
        qualification: '',
        experience: '',
        skills: '',
        currentCompany: '',
        currentRole: '',
        expectedSalary: ''
    });

    const navigate = useNavigate();

    useEffect(() => {
        if (!isAuthenticated()) {
            navigate('/');
        }
    }, [navigate]);

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
    // const handleFileChange = (e) => setFormData({ ...formData});

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate required fields
        const requiredFields = [
            'firstName', 'lastName', 'email', 'contact',
            'age', 'gender', 'address', 'city', 'pincode',
            'qualification', 'experience', 'skills', 'expectedSalary'
        ];

        const emptyFields = requiredFields.filter(field => !formData[field]);
        if (emptyFields.length > 0) {
            toast.error('Please fill all required fields');
            return;
        }

        try {
            const response = await axios.post('http://localhost:5000/api/job-applications', formData, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (response.data.success) {
                toast.success('Application submitted successfully');
                // Reset form
                setFormData({
                    firstName: '',
                    lastName: '',
                    email: '',
                    contact: '',
                    age: '',
                    gender: '',
                    address: '',
                    city: '',
                    pincode: '',
                    qualification: '',
                    experience: '',
                    skills: '',
                    currentCompany: '',
                    currentRole: '',
                    expectedSalary: ''
                });
            }
        } catch (error) {
            console.error('Submit error:', error);
            toast.error(error.response?.data?.message || 'Failed to submit application');
        }
    };

    return (
        <div className=" font-outfit min-h-screen py-8 px-4">
            <ToastContainer />
            <div className="max-w-4xl mx-auto">
                <div className="bg-white/20 backdrop-blur-md rounded-xl p-8 shadow-lg border border-white/20">
                    <h1 className="text-3xl font-light text-center text-gray-800 mb-8">Career Application</h1>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Form Section */}
                        <div className="lg:col-span-2 h-[calc(100vh-200px)] overflow-y-auto px-4
                                [&::-webkit-scrollbar]:w-2
                                [&::-webkit-scrollbar-track]:bg-transparent
                                [&::-webkit-scrollbar-thumb]:bg-gray-800/50
                                [&::-webkit-scrollbar-thumb]:rounded-full">
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <input type="text" name="firstName" className="w-full p-3 rounded-lg bg-white/50 backdrop-blur-sm border placeholder:text-gray-600 border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all" placeholder="First Name" onChange={handleChange} value={formData.firstName} required />
                                    <input type="text" name="lastName" className="w-full p-3 rounded-lg bg-white/50 backdrop-blur-sm border placeholder:text-gray-600 border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all" placeholder="Last Name" onChange={handleChange} value={formData.lastName} required />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <input type="email" className="w-full p-3 rounded-lg bg-white/50 backdrop-blur-sm border placeholder:text-gray-600 border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all" name="email" placeholder="Email" onChange={handleChange} value={formData.email} required />
                                    <input type="tel" name="contact" className="w-full p-3 rounded-lg bg-white/50 backdrop-blur-sm border placeholder:text-gray-600 border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all" placeholder="Contact" onChange={handleChange} value={formData.contact} required />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <input type="text" name="age" className="w-full p-3 rounded-lg bg-white/50 backdrop-blur-sm border placeholder:text-gray-600 border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all" placeholder="Age" onChange={handleChange} value={formData.age} required />
                                    <select name="gender" className="w-full p-3 rounded-lg bg-white/50 backdrop-blur-sm border placeholder:text-gray-600 border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all" onChange={handleChange} value={formData.gender} required>
                                        <option value="">Select Gender</option>
                                        <option value="male">Male</option>
                                        <option value="female">Female</option>
                                        <option value="other">Other</option>
                                    </select>
                                </div>

                                <textarea name="address" placeholder="Address" rows="3" className="w-full p-3 rounded-lg placeholder:text-gray-600 bg-white/50 backdrop-blur-sm border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all resize-none" onChange={handleChange} value={formData.address} required></textarea>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <input type="text" name="city" placeholder="City" className="w-full p-3 rounded-lg placeholder:text-gray-600 bg-white/50 backdrop-blur-sm border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all" onChange={handleChange} value={formData.city} required />
                                    <input type="text" name="pincode" placeholder="Pincode" className="w-full p-3 rounded-lg placeholder:text-gray-600 bg-white/50 backdrop-blur-sm border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all" onChange={handleChange} value={formData.pincode} required />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* ...existing personal info fields... */}

                                    <input
                                        type="text"
                                        name="qualification"
                                        placeholder="Highest Qualification"
                                        value={formData.qualification}
                                        onChange={handleChange}
                                        required
                                        className="w-full p-3 placeholder:text-gray-600 rounded-lg bg-white/50 backdrop-blur-sm
                 border border-gray-200 focus:ring-2 focus:ring-blue-500
                 outline-none transition-all"
                                    />

                                    <input
                                        type="text"
                                        name="experience"
                                        placeholder="Years of Experience"
                                        value={formData.experience}
                                        onChange={handleChange}
                                        required
                                        className="w-full p-3 rounded-lg placeholder:text-gray-600 bg-white/50 backdrop-blur-sm
                 border border-gray-200 focus:ring-2 focus:ring-blue-500
                 outline-none transition-all"
                                    />

                                    <input
                                        type="text"
                                        name="skills"
                                        placeholder="Skills (comma separated)"
                                        value={formData.skills}
                                        onChange={handleChange}
                                        required
                                        className="w-full p-3 rounded-lg bg-white/50 backdrop-blur-sm
                 border border-gray-200 focus:ring-2 placeholder:text-gray-600 focus:ring-blue-500
                 outline-none transition-all"
                                    />

                                    <input
                                        type="text"
                                        name="currentCompany"
                                        placeholder="Current Company (if any)"
                                        value={formData.currentCompany}
                                        onChange={handleChange}
                                        className="w-full p-3 rounded-lg bg-white/50 backdrop-blur-sm
                 border border-gray-200 focus:ring-2 placeholder:text-gray-600 focus:ring-blue-500
                 outline-none transition-all"
                                    />

                                    <input
                                        type="text"
                                        name="currentRole"
                                        placeholder="Current Role"
                                        value={formData.currentRole}
                                        onChange={handleChange}
                                        className="w-full p-3 rounded-lg bg-white/50 backdrop-blur-sm
                 border border-gray-200 focus:ring-2 placeholder:text-gray-600 focus:ring-blue-500
                 outline-none transition-all"
                                    />

                                    <input
                                        type="text"
                                        name="expectedSalary"
                                        placeholder="Expected Salary (per annum)"
                                        value={formData.expectedSalary}
                                        onChange={handleChange}
                                        required
                                        className="w-full p-3 rounded-lg bg-white/50 backdrop-blur-sm
                 border border-gray-200 focus:ring-2 placeholder:text-gray-600 focus:ring-blue-500
                 outline-none transition-all"
                                    />


                                </div>
                                <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-all duration-300">
                                    Submit Application
                                </button>
                            </form>
                        </div>

                        {/* Information Section */}
                        <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 h-fit">
                            <h2 className="text-xl font-light text-gray-800 mb-4">Important Information</h2>
                            <div className="space-y-4">
                                <div className="flex items-start gap-3">
                                    <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                                        <span className="text-blue-600 text-sm">1</span>
                                    </div>
                                    <p className="text-sm text-gray-600">
                                        We will contact you via email or phone if your data matches our requirements.
                                    </p>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                                        <span className="text-blue-600 text-sm">2</span>
                                    </div>
                                    <p className="text-sm text-gray-600">
                                        Job role and position will be determined based on your qualifications and interview performance.
                                    </p>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                                        <span className="text-blue-600 text-sm">3</span>
                                    </div>
                                    <p className="text-sm text-gray-600">
                                        what document you have to borrow will be metion in the email or message that sent to you if you are selected.
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={() => navigate(-1)}
                                className="px-5 font-outfit py-2 flex bg-white/30 mt-4 ml-16 border-2 border-gray-800/20 rounded-full items-center gap-2 text-gray-600 
                             hover:bg-blue-500 hover:text-white transition-colors"
                            >
                                {/* <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" 
                         viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" 
                              d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" 
                              clipRule="evenodd" />
                    </svg> */}
                                Back
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Job;
