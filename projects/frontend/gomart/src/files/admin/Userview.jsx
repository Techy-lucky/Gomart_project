import { useState, useEffect } from 'react';
import axios from '../../api/axios';
import search from "../../images/icon/search-circle-stroke-rounded.svg";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../../css files/ALLanimation.css'

function Userview() {
    const [users, setUsers] = useState([]);
    const [filters, setFilters] = useState({
        search: '',
        userType: 'all',
        sortBy: 'name'
    });

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await axios.get('/admin/users', {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            setUsers(response.data.users);
        } catch (error) {
            console.error('Fetch Users Error:', error.response || error.message);
            toast.error('Failed to fetch users');
        }
    };

    const handleDelete = async (userId, userType) => {
        if (window.confirm('Are you sure you want to delete this user?')) {
            try {
                await axios.delete(`/admin/users/${userType}/${userId}`, {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                });
                toast.success('User deleted successfully');
                fetchUsers(); // Refresh the list after deletion
            } catch (error) {
                console.error('Delete User Error:', error.response || error.message);
                toast.error('Failed to delete user');
            }
        }
    };
    

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const filteredUsers = users
        .filter(user => {
            const matchesSearch = user.fullName?.toLowerCase().includes(filters.search.toLowerCase()) ||
                                  user.email?.toLowerCase().includes(filters.search.toLowerCase());
            const matchesType = filters.userType === 'all' || user.type === filters.userType;
            return matchesSearch && matchesType;
        })
        .sort((a, b) => {
            const sortField = filters.sortBy;
            if (!a[sortField] || !b[sortField]) return 0; // Skip sorting if fields are undefined
            return sortField === 'date'
                ? new Date(b.createdAt) - new Date(a.createdAt)
                : a[sortField]?.localeCompare(b[sortField]);
        });

    return (
        <div className="anime bg-white/30 backdrop-blur-md rounded-xl w-[97%] h-[94vh] mx-auto mt-5 p-5 font-outfit">
            <h2 className='anime text-center text-2xl font-light mt-2 mb-3'>All User</h2>
            <ToastContainer position="top-right" autoClose={3000} />

            {/* Search and Filters */}
            <div className="anime grid grid-cols-1 md:grid-cols-3 px-2 gap-4 mb-3">
                <div className="relative">
                    <img src={search} alt="search" className="absolute left-3 top-1/2 transform -translate-y-1/2 w-6 h-6" />
                    <input
                        type="text"
                        name="search"
                        placeholder="Search users..."
                        className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/50 border border-black/30 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        value={filters.search}
                        onChange={handleFilterChange}
                    />
                </div>

                <select
                    name="userType"
                    className="px-4 py-3 rounded-xl bg-white/50 border border-black/30 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    value={filters.userType}
                    onChange={handleFilterChange}
                >
                    <option value="all">All Users</option>
                    <option value="normal">Normal Users</option>
                    <option value="google">Google Users</option>
                </select>

                <select
                    name="sortBy"
                    className="px-4 py-3 rounded-xl bg-white/50 border border-black/30 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    value={filters.sortBy}
                    onChange={handleFilterChange}
                >
                    <option value="name">Sort by Name</option>
                    <option value="email">Sort by Email</option>
                    <option value="date">Sort by Date</option>
                </select>
            </div>

            {/* Users Table */}
            <div className="anime h-[calc(100%-110px)] overflow-y-auto px-3 [&::-webkit-scrollbar]:w-2
      [&::-webkit-scrollbar-track]:bg-transparent 
      [&::-webkit-scrollbar-thumb]:bg-gray-400/50
      [&::-webkit-scrollbar-thumb]:rounded-full
      dark:[&::-webkit-scrollbar-thumb]:bg-gray-600/50
      hover:[&::-webkit-scrollbar-thumb]:bg-gray-400
      dark:hover:[&::-webkit-scrollbar-thumb]:bg-gray-600">
                <table className="anime w-full bg-white/50 rounded-xl">
                    <thead>
                        <tr className="text-left border-b">
                            <th className="p-4">fullName</th>
                            <th className="p-4">Email</th>
                            <th className="p-4">User Type</th>
                            <th className="p-4">Joined Date</th>
                            <th className="p-4">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredUsers.length > 0 ? (
                            filteredUsers.map((user) => (
                                <tr key={user._id} className="anime border-b hover:bg-white/30 transition-colors">
                                    <td className="p-4">{user.fullName}</td>
                                    <td className="p-4">{user.email}</td>
                                    <td className="p-4">
                                        <span className={`px-3 py-1 rounded-full text-sm ${
                                            user.type === 'google' 
                                                ? 'bg-blue-100 text-blue-700' 
                                                : 'bg-green-100 text-green-700'
                                        }`}>
                                            {user.type === 'google' ? 'Google' : 'Normal'}
                                        </span>
                                    </td>
                                    <td className="p-4">
                                        {new Date(user.createdAt).toLocaleDateString()}
                                    </td>
                                    <td className="p-4">
                                        <button
                                            onClick={() => handleDelete(user._id, user.type)}
                                            className="px-3 py-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors text-sm"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5" className="text-center py-4">No users found</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default Userview;
