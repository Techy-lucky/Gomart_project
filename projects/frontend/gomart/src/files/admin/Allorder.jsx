import { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import axios from "axios";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import '../../css files/ALLanimation.css'

const OrderShowPage = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedOrderForStatus, setSelectedOrderForStatus] = useState(null);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const navigate = useNavigate();
  const [newStatus, setNewStatus] = useState("");

  useEffect(() => {
    const fetchAdminProfile = async () => {
      try {
        await axios.get('http://localhost:5000/admin/profile', { withCredentials: true });
      } catch {
        toast.error('Admin session expired. Redirecting to login...');
        navigate('/adminlogin');
      }
    };
    fetchAdminProfile();
  }, [navigate]);
  // Fetch orders from the backend
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/orders");
        if (response.ok) {
          const data = await response.json();
          setOrders(data);
        } else {
          toast.error("Failed to fetch orders.");
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
        toast.error("Something went wrong.");
      }
    };
    fetchOrders();
  }, []);

  // Delete an order
  const deleteOrder = async (orderId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/orders/${orderId}`, {
        method: "DELETE",
      });
      if (response.ok) {
        setOrders((prevOrders) => prevOrders.filter((order) => order._id !== orderId));
        toast.success("Order deleted successfully.");
      } else {
        toast.error("Failed to delete order.");
      }
    } catch (error) {
      console.error("Error deleting order:", error);
      toast.error("Something went wrong.");
    }
  };

  const updateStatus = async () => {
    if (!selectedOrderForStatus || !newStatus) return;
    try {
      const response = await fetch(`http://localhost:5000/api/orders/${selectedOrderForStatus._id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (response.ok) {
        setOrders((prev) => prev.map((order) => (order._id === selectedOrderForStatus._id ? { ...order, status: newStatus } : order)));
        setShowStatusModal(false);
        toast.success("Order status updated successfully");
      } else {
        toast.error("Failed to update status");
      }
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Something went wrong");
    }
  };


  return (
    <div className="anime bg-white/20 backdrop-blur-md rounded-xl w-[97%] h-[94vh] font-outfit mx-auto mt-5 p-6">
      <h2 className="anime text-2xl font-light text-center mb-3">All Orders</h2>

      <div className="anime h-[78vh] rounded-xl overflow-y-auto p-3
       [&::-webkit-scrollbar]:w-2
      [&::-webkit-scrollbar-track]:bg-transparent
    [&::-webkit-scrollbar-thumb]:bg-gray-800/50
      [&::-webkit-scrollbar-thumb]:rounded-full">
        {orders.length > 0 ? (
          <table className="anime w-full bg-white/50 rounded-xl">
            <thead>
              <tr className="text-center border-b border-gray-200">
                <th className="p-4">Order ID</th>
                <th className="p-4">Customer</th>
                <th className="p-4">Total Amount</th>
                <th className="p-4">Date</th>
                <th className="p-4">Status</th>
                <th className="p-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id} className="anime text-center border-b border-gray-200 hover:bg-white/30">
                  <td className="p-4">{order._id.slice(-6)}</td>
                  <td className="p-4">{order.deliveryInfo.fullName}</td>
                  <td className="p-4">₹{order.totalAmount}</td>
                  <td className="p-4">{new Date(order.createdAt).toLocaleDateString()}</td>
                  <td className="p-4"><p className="text-center rounded-full text-black">{order.status}</p></td>
                  <td className="p-4">
                    <div className="flex gap-2">
                      <button onClick={() => { setSelectedOrderForStatus(order); setShowStatusModal(true); }}
                        className="px-3 py-1 bg-orange-400 text-black rounded-full 
                                 hover:bg-orange-600 hover:text-white transition-colors text-sm"
                      >Update Status</button>
                      <button
                        onClick={() => {
                          setSelectedOrder(order);
                          setShowModal(true);
                        }}
                        className="px-3 py-1 bg-blue-400 text-black rounded-full 
                                 hover:bg-blue-600  hover:text-white transition-colors text-sm"
                      >
                        View
                      </button>
                      <button
                        onClick={() => deleteOrder(order._id)}
                        className="px-3 py-1 bg-red-400 text-black rounded-full 
                                 hover:bg-red-600  hover:text-white transition-colors text-sm"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-center text-gray-600">No orders found.</p>
        )}
      </div>

      {/* Order Details Modal */}
      {showModal && selectedOrder && (
        <div className="anime fixed inset-0 bg-white/20 rounded-lg backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="anime bg-white/90 backdrop-blur-md rounded-xl w-full max-w-4xl 
                          max-h-[90vh] flex flex-col">
            {/* Modal Header - Sticky */}
            <div className="sticky top-0 z-10 bg-white/90 backdrop-blur-md p-6 
                            border-b flex justify-between items-center rounded-t-xl">
              <h3 className="text-xl font-semibold">Order #{selectedOrder._id.slice(-6)}</h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ×
              </button>
            </div>

            {/* Modal Body - Scrollable */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6
                            scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent
                            hover:scrollbar-thumb-gray-400">
              {/* Customer & Order Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white/50 rounded-xl p-4">
                  <h4 className="font-medium mb-3">Customer Details</h4>
                  <div className="space-y-2 text-sm">
                    <p><span className="text-gray-600">Name:</span> {selectedOrder.deliveryInfo.fullName}</p>
                    <p><span className="text-gray-600">E-mail:</span> {selectedOrder.deliveryInfo.email || 'None'}</p>
                    <p><span className="text-gray-600">Phone:</span> {selectedOrder.deliveryInfo.contact}</p>
                    <p><span className="text-gray-600">Address:</span> {selectedOrder.deliveryInfo.address}</p>
                    <p><span className="text-gray-600">City:</span> {selectedOrder.deliveryInfo.city}</p>
                    <p><span className="text-gray-600">Pincode:</span> {selectedOrder.deliveryInfo.pincode}</p>
                  </div>
                </div>

                <div className="bg-white/50 rounded-xl p-4">
                  <h4 className="font-medium mb-3">Order Information</h4>
                  <div className="space-y-2 text-sm">
                    <p><span className="text-gray-600">Order Date:</span> {new Date(selectedOrder.createdAt).toLocaleString()}</p>
                    <br />
                    <br />
                    <span >Notes</span>
                    <br />
                    <span>delivery charge will be 40 Rs</span>
                    <br></br>
                    <span>express delivery charge will be 60 Rs</span>
                    <div className="flex items-center gap-2">
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Details */}
              <div className="bg-white/50 rounded-xl p-4">
                <h4 className="font-medium mb-3">Payment Details</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <p><span className="text-gray-600">Payment Mode:</span> {selectedOrder.paymentInfo.mode}</p>
                  <p><span className="text-gray-600">Transaction ID:</span> {selectedOrder.paymentInfo.upiId || 'N/A'}</p>
                </div>
              </div>

              {/* Products List */}
              <div className="bg-white/50 rounded-xl p-4">
                <h4 className="font-medium mb-3">Products</h4>
                <div className="space-y-3">
                  {selectedOrder.products.map((product, index) => (
                    <div key={index} className="flex items-center gap-4 p-3 bg-white/70 rounded-lg">
                      <img
                        src={product.image}
                        alt={product.name || product.productName}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <h5 className="font-medium">{product.name || product.productName}</h5>
                        <p className="text-sm text-gray-600">Quantity: {product.quantity}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">₹{product.price}</p>
                        <p className="text-sm text-gray-600">Total: ₹{product.price * product.quantity}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Summary */}
              <div className="border-t pt-4">
                <div className="flex justify-end space-x-4 text-right">
                  <div>
                    <p className="text-gray-600">Subtotal:</p>
                    <p className="text-gray-600">Delivery Charge:</p>
                    <p className="font-medium text-lg mt-2">Total Amount:</p>
                  </div>
                  <div>
                    <p>₹{selectedOrder.totalAmount - (selectedOrder.deliveryCharge || 40)}</p>
                    <p>₹{selectedOrder.deliveryCharge || 40}</p>
                    <p className="font-medium text-lg mt-2">₹{selectedOrder.totalAmount}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {showStatusModal && selectedOrderForStatus && (
        <div className="anime fixed inset-0 flex items-center justify-center bg-white/10 rounded-lg backdrop-blur-sm z-50">
          <div className="anime bg-white p-6 rounded-xl shadow-lg w-96 text-center">
            <h3 className="aime text-lg font-semibold">Update Order Status</h3>
            <p className="anime text-gray-600 text-sm mb-3">Order ID: <span className="font-semibold">{selectedOrderForStatus._id.slice(-6)}</span></p>
            <select className="anime w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500" value={newStatus} onChange={(e) => setNewStatus(e.target.value)}>
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
            <div className="anime flex justify-between mt-4">
              <button className="anime bg-gray-300 text-gray-800 px-4 py-2 rounded-full hover:bg-gray-400 transition" onClick={() => setShowStatusModal(false)}>Cancel</button>
              <button className="anime bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700 transition" onClick={updateStatus}>Update</button>
            </div>
          </div>
        </div>
      )}
      <ToastContainer />
    </div>
  );
};

export default OrderShowPage;
