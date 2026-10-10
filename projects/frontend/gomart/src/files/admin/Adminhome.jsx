import { useEffect, useState } from 'react';
import axios from '../../api/axios';
import { toast } from 'react-toastify';
import { useNavigate, Link } from 'react-router-dom';
import Modal from 'react-modal';
import '../../css files/ALLanimation.css'

function AdminDashboard() {
    const navigate = useNavigate();
    const [stats, setStats] = useState({
        users: 0,
        googleUsers: 0,
        orders: 0,
        feedbacks: 0,
        products: 0,
        totalProductCost: 0,
        totalProductstock: 0,
        totalCategories: 0,
        totalSubCategories: 0,
        posters: 0,
        resumes: 0,
        admins: 0
    });
    const [feedbacks, setFeedbacks] = useState([]);
    const [selectedFeedback, setSelectedFeedback] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const [usersRes, ordersRes, feedbackRes, productsRes, postersRes, resumesRes, adminsRes] = await Promise.all([
                    axios.get('/admin/users'),
                    axios.get('/api/orders'),
                    axios.get('/api/feedbacks/all'),
                    axios.get('/products'),
                    axios.get('/api/posters'),
                    axios.get('/api/job-applications'),
                    axios.get('/admin/profile/all')
                ]);

                const products = productsRes.data.products || [];

                // Calculate total product cost
                const totalCost = products.reduce((acc, product) => acc + (product.price || 0), 0);
                const totalstock = products.reduce((acc, product) => acc + (product.stock || 0), 0);

                // Extract unique categories and subcategories
                const categories = new Set();
                const subCategories = new Set();

                products.forEach(product => {
                    if (product.category) categories.add(product.category);
                    if (product.subcategory) subCategories.add(product.subcategory);
                });

                setStats({
                    users: usersRes.data.users.filter(user => user.type === 'normal').length,
                    googleUsers: usersRes.data.users.filter(user => user.type === 'google').length,
                    orders: ordersRes.data.length,
                    feedbacks: feedbackRes.data.feedbacks.length,
                    products: products.length,
                    totalProductCost: totalCost,
                    totalProductstock: totalstock,
                    totalCategories: categories.size,
                    totalSubCategories: subCategories.size,
                    posters: postersRes.data.length,
                    resumes: resumesRes.data.length,
                    admins: adminsRes.data.length || '-'
                });

                setFeedbacks(feedbackRes.data.feedbacks);
            } catch (error) {
                console.error('Error fetching stats:', error);
                if (error.response?.status === 401) {
                    toast.error('Please login to access this page');
                    navigate('/adminlogin');
                } else {
                    toast.error('Failed to load dashboard stats');
                }
            }
        };

        fetchStats();
    }, [navigate]);

    const handleDeleteFeedback = async (id) => {
        try {
            await axios.delete(`/api/feedbacks/${id}`);
            setFeedbacks(prev => prev.filter(feedback => feedback._id !== id));
            toast.success('Feedback deleted successfully');
        } catch (error) {
            console.error('Error deleting feedback:', error);
            toast.error('Failed to delete feedback');
        }
    };

    const handleViewFeedback = (feedback) => {
        setSelectedFeedback(feedback);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedFeedback(null);
    };

    return (
        <div className="anime bg-white/20 backdrop-blur-md font-outfit rounded-xl w-[97%] h-[94vh] mx-auto mt-5 p-3">
            <h2 className="anime text-2xl mt-1 font-light mb-3 text-center">Admin Dashboard</h2>
            <div className='grid grid-cols-3 gap-3'>
                <div className="anime bg-white/30 backdrop-blur-sm rounded-xl p-6 hover:bg-white/40 transition-all duration-300">
                    <Link to='/adminallorder'>
                        <div className="anime flex items-center justify-between">
                            <div>
                                <p className=" text-gray-600 text-sm">Total Orders</p>
                                <h3 className=" anime text-3xl font-light mt-2">{stats.orders}</h3>
                            </div>
                            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                </svg>
                            </div>
                        </div>
                    </Link>
                </div>

                {/* Users Card */}
                <div className="anime bg-white/30 backdrop-blur-sm rounded-xl p-6 hover:bg-white/40 transition-all duration-300">
                    <Link to='/adminuserview'>
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-600 text-sm">Total Users</p>
                                <h3 className="text-3xl font-light mt-2">{stats.users + stats.googleUsers}</h3>
                            </div>
                            <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                                </svg>
                            </div>
                        </div>
                    </Link>
                </div>
                <div className="anime bg-white/30 backdrop-blur-sm rounded-xl p-6 hover:bg-white/40 transition-all duration-300">
                    <Link to='/adminresume'>
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-600 text-sm">Job Applications</p>
                                <h3 className="text-3xl font-light mt-2">{stats.resumes}</h3>
                            </div>
                            <div className="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center">
                                <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                            </div>
                        </div>
                    </Link>
                </div>
            </div>
            {/* Feedback Section */}
            <div className="anime grid grid-cols-1 md:grid-cols-3 gap-3 mt-3">
                <div className="bg-white/30 backdrop-blur-sm rounded-xl p-6 md:col-span-2">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    </div>
                    {/* Additional Stats Grid */}
                    <div className="anime grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                        <div className="bg-white/30 backdrop-blur-sm rounded-xl p-6">
                            <h4 className="text-lg font-light mb-4">User distribution</h4>
                            <div className="space-y-4">
                                <div>
                                    <div className="flex justify-between text-sm mb-1">
                                        <span>Normal Users</span>
                                        <span>{stats.users}</span>
                                    </div>
                                    <div className="h-2 bg-white/30 rounded-full overflow-hidden">
                                        <div className="h-full bg-blue-500 rounded-full"
                                            style={{ width: `${(stats.users / (stats.users + stats.googleUsers)) * 100}%` }}></div>
                                    </div>
                                </div>
                                <div>
                                    <div className="flex justify-between text-sm mb-1">
                                        <span>Google Users</span>
                                        <span>{stats.googleUsers}</span>
                                    </div>
                                    <div className="h-2 bg-white/30 rounded-full overflow-hidden">
                                        <div className="h-full bg-green-500 rounded-full"
                                            style={{ width: `${(stats.googleUsers / (stats.users + stats.googleUsers)) * 100}%` }}></div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="anime bg-white/30 backdrop-blur-sm rounded-xl p-6">
                            <h4 className="text-lg font-light mb-4">Content Stats</h4>
                            <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <span>Products</span>
                                    <span className="text-2xl font-light">{stats.products}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span>Posters</span>
                                    <span className="text-2xl font-light">{stats.posters}</span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white/30 backdrop-blur-sm rounded-xl p-6">
                            <h4 className="text-lg font-light mb-4">Feedback & Support</h4>
                            <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <span>Total Feedbacks</span>
                                    <span className="text-2xl font-light">{stats.feedbacks}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span>Admin Users</span>
                                    <span className="text-2xl font-light">{stats.admins}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="anime bg-white/30 backdrop-blur-sm rounded-xl p-6">
                    <h4 className="text-lg font-light mb-4">Feedback List</h4>
                    <div className="max-h-44  overflow-y-auto  [&::-webkit-scrollbar]:w-1 p-2
                                [&::-webkit-scrollbar-track]:bg-transparent
                                [&::-webkit-scrollbar-thumb]:bg-gray-800/50
                                [&::-webkit-scrollbar-thumb]:rounded-full">
                        {feedbacks.map(feedback => (
                            <div key={feedback._id} className="anime flex justify-between items-center font-light border-b py-2">
                                <div>
                                    <p className="text-sm font-normal">{feedback.userName}</p>
                                    <p className="text-xs line-clamp-1 text-gray-500">{feedback.feedback.substring(0, 30)}...</p>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handleViewFeedback(feedback)}
                                        className="bg-blue-500 text-sm text-white px-3 py-1 rounded-full"
                                    >View</button>
                                    <button
                                        onClick={() => handleDeleteFeedback(feedback._id)}
                                        className="bg-red-500 text-sm text-white px-3 py-1  rounded-full"
                                    >Delete</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            {/* Feedback Modal */}
            <Modal
                isOpen={isModalOpen}
                onRequestClose={closeModal}
                className="anime  bg-white p-6 h-[60vh] w-[80vh] flex justify-center items-center rounded-md shadow-lg max-w-md mx-auto mt-20"
                overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center"
            >
                {selectedFeedback && (
                    <div className=''>
                        <h2 className="anime text-xl font-outfit text-center font-medium mb-4">Feedback Details</h2>
                        <p className='anime font-outfit'><strong>User:</strong> {selectedFeedback.userName}</p>
                        <p className='anime font-outfit'><strong>Email:</strong> {selectedFeedback.userEmail}</p>
                        <p className='anime font-outfit'><strong>Feedback:</strong> {selectedFeedback.feedback}</p>
                        <button onClick={closeModal} className="mt-8 bg-gray-500 ml-36 mr-36 text-white px-7 py-2 font-outfit rounded-full">Close</button>
                    </div>
                )}
            </Modal>
            <div className="anime bg-white/30 backdrop-blur-sm rounded-xl p-3 mt-3">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                    <div className="bg-white/40 backdrop-blur-md rounded-xl p-3">
                        <h5 className="text-md font-light">Total Product Cost</h5>
                        <p className="text-2xl font-light">₹{stats.totalProductCost}</p>
                    </div>
                    <div className="bg-white/40 backdrop-blur-md rounded-xl p-3">
                        <h5 className="text-md font-light">Total Product stock</h5>
                        <p className="text-2xl font-light">{stats.totalProductstock}</p>
                    </div>
                    <div className="bg-white/40 backdrop-blur-md rounded-xl p-4">
                        <h5 className="text-md font-light">Total Categories</h5>
                        <p className="text-2xl font-light">{stats.totalCategories}</p>
                    </div>
                    <div className="bg-white/40 backdrop-blur-md rounded-xl p-4">
                        <h5 className="text-md font-light">Total Subcategories</h5>
                        <p className="text-2xl font-light">{stats.totalSubCategories}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AdminDashboard;
