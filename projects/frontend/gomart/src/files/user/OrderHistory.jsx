import { useState, useEffect } from 'react';
import axios from '../../api/axios';
import { toast } from 'react-toastify';
import { isAuthenticated } from '../../api/axios';
import { useNavigate } from 'react-router-dom';
import { PDFDownloadLink, Document, Page, Text, View, StyleSheet, Font } from '@react-pdf/renderer';
import '../../css files/ALLanimation.css'
import PropTypes from 'prop-types';


Font.register({
    family: 'Helvetica-Bold',
    src: 'https://fonts.gstatic.com/s/helvetica/v11.woff2',
});

const styles = StyleSheet.create({
    page: {
        padding: 30,
        fontFamily: 'Helvetica',
    },
    header: {
        textAlign: 'center',
        marginBottom: 20,
        paddingBottom: 10,
        borderBottom: '2px solid #000',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        textTransform: 'uppercase',
    },
    subTitle: {
        fontSize: 12,
        marginBottom: 5,
        color: '#666',
    },
    section: {
        marginBottom: 15,
        padding: 10,
        border: '1px solid #ddd',
        borderRadius: 5,
        backgroundColor: '#f9f9f9',
    },
    label: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#333',
    },
    text: {
        fontSize: 12,
        color: '#444',
    },
    tableHeader: {
        flexDirection: 'row',
        backgroundColor: '#333',
        color: 'white',
        padding: 6,
        borderRadius: 5,
    },
    tableRow: {
        flexDirection: 'row',
        borderBottom: '1px solid #ddd',
        paddingVertical: 6,
    },
    tableCell: {
        fontSize: 11,
        flex: 1,
        textAlign: 'center',
    },
    totals: {
        marginTop: 20,
        padding: 10,
        borderTop: '2px solid #000',
        fontSize: 14,
        fontWeight: 'bold',
    },
    footer: {
        textAlign: 'center',
        marginTop: 30,
        fontSize: 10,
        color: '#777',
    },
});

function OrderHistory() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (!isAuthenticated()) {
            navigate('/');
        }
    }, [navigate]);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                toast.error('Please login to view order history');
                return;
            }

            const response = await axios.get('http://localhost:5000/api/orders/history', {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (response.data.success) {
                setOrders(response.data.orders); // Ensure the key is 'orders'
            } else {
                toast.error(response.data.message || 'Failed to fetch orders');
            }
            setLoading(false);
        } catch (error) {
            console.error('Order fetch error:', error);
            toast.error('Failed to fetch orders');
            setLoading(false);
        }
    };


    const InvoicePDF = ({ order }) => (
        <Document>
            <Page size="A4" style={styles.page}>
                <View style={styles.header}>
                    <Text style={styles.title}>GoMart</Text>
                    <Text style={styles.subTitle}>E-Commerce Shopping</Text>
                    <Text style={styles.subTitle}>www.gomart.com | support@gomart.com</Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.label}>
                        Invoice Date: <Text style={styles.text}>{new Date(order.createdAt).toLocaleDateString()}</Text>
                    </Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.label}>Customer Details:</Text>
                    <Text style={styles.text}>Name: {order.deliveryInfo.fullName}</Text>
                    <Text style={styles.text}>Email: {order.deliveryInfo.email}</Text>
                    <Text style={styles.text}>Contact: {order.deliveryInfo.contact}</Text>
                    <Text style={styles.text}>Address: {order.deliveryInfo.address}, {order.deliveryInfo.city}, {order.deliveryInfo.pincode}</Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.label}>Product Details:</Text>
                    <View style={styles.tableHeader}>
                        <Text style={styles.tableCell}>Product</Text>
                        <Text style={styles.tableCell}>Qty</Text>
                        <Text style={styles.tableCell}>Price</Text>
                        <Text style={styles.tableCell}>Total</Text>
                    </View>
                    {order.products.map((product, index) => (
                        <View style={styles.tableRow} key={index}>
                            <Text style={styles.tableCell}>{product.name || product.productName}</Text>
                            <Text style={styles.tableCell}>{product.quantity}</Text>
                            <Text style={styles.tableCell}>₹{product.price}</Text>
                            <Text style={styles.tableCell}>₹{product.quantity * product.price}</Text>
                        </View>
                    ))}
                </View>

                <View style={styles.totals}>
                    <Text>Total Amount: ₹{order.totalAmount}</Text>
                </View>

                <View style={styles.footer}>
                    <Text>Thank you for shopping with GoMart!</Text>
                    <Text>For support, contact: support@gomart.com</Text>
                </View>
            </Page>
        </Document>
    );

    return (
        <div className="bg-white/20 font-outfit backdrop-blur-md rounded-xl w-[97%] h-[94vh] mx-auto mt-5 p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-light">Order History</h2>
                <button
                    onClick={() => navigate('/profile')}
                    className="px-5 py-2 bg-white/50 hover:text-white flex items-center gap-2 border-2 border-gray-200/40 rounded hover:bg-blue-500 text-gray-600 
                            transition-colors"
                >
                    Back
                </button>
            </div>

            {loading ? (
                <div className="flex justify-center items-center h-[60vh]">
                    <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
                </div>
            ) : orders.length === 0 ? (
                <div className="text-center text-gray-600 py-8">
                    No orders found
                </div>
            ) : (
                <div className="overflow-y-auto h-[77vh] p-3 
                 [&::-webkit-scrollbar]:w-2
                [&::-webkit-scrollbar-track]:bg-transparent
             [&::-webkit-scrollbar-thumb]:bg-gray-800/50
                [&::-webkit-scrollbar-thumb]:rounded-full grid grid-cols-4 gap-5">
                    {orders.map((order) => (
                        <div key={order._id}
                            className="bg-white/30 backdrop-blur-sm h-[35vh] rounded-xl p-4 border  border-white/20 ">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <p className="text-sm text-gray-600">Order ID: {order._id.slice(-6)}</p>
                                    <p className="font-medium mt-1">₹{order.totalAmount}</p>
                                </div>
                                <span className={`px-3 py-1 rounded-full text-xs
                                    ${order.status === 'completed' ? 'bg-green-100 text-green-700' :
                                        order.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                                            order.status === 'processing' ? 'bg-blue-100 text-blue-700' : 'bg-red-100 text-red-700'}`}>
                                    {order.status || 'Processing'}
                                </span>
                            </div>

                            <div className="space-y-2">
                                <p className="text-sm">
                                    <span className="text-gray-600">Date: </span>
                                    {new Date(order.createdAt).toLocaleDateString()}
                                </p>
                                <p className="text-sm">
                                    <span className="text-gray-600">Items: </span>
                                    {order.products.length}
                                </p>
                                <p className="text-sm">
                                    <span className="text-gray-600">Payment: </span>
                                    {order.paymentInfo.mode}
                                </p>
                            </div>

                            <div className='anime flex justify-center gap-2 mt-4 '>
                                <button
                                    onClick={() => {
                                        setSelectedOrder(order);
                                        setShowModal(true);
                                    }}
                                    className=" bg-blue-600 text-white py-2 px-5 rounded-full
                                         hover:bg-blue-700 transition-colors text-sm"
                                >
                                    View details
                                </button>
                                <PDFDownloadLink document={<InvoicePDF order={order} />} fileName={`Invoice_${order._id}.pdf`}>
                                    {({ loading }) =>
                                        loading ? (
                                            <button className="px-7 py-2 text-sm bg-gray-400 rounded-full">Loading...</button>
                                        ) : (
                                            <button className="px-10 py-2 text-sm bg-blue-500 text-white rounded-full hover:bg-blue-600 transition">
                                            E-Bill
                                            </button>
                                        )
                                    }
                                </PDFDownloadLink>
                            </div>

                        </div>
                    ))}
                </div>
            )}

            {/* Order Details Modal */}
            {showModal && selectedOrder && (
                <div className="anime fixed inset-0 bg-white/20 rounded-md backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white/90 backdrop-blur-md rounded-xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
                        <div className="p-6 border-b flex justify-between items-center">
                            <h3 className="text-xl font-semibold">Order Details</h3>
                            <button
                                onClick={() => setShowModal(false)}
                                className="text-gray-500 hover:text-gray-700 text-2xl"
                            >
                                ×
                            </button>
                        </div>
                        <div className="p-6 overflow-y-auto custom-scrollbar">
                            <div className="space-y-6">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <h4 className="font-medium mb-2">Delivery Details</h4>
                                        <p className="text-sm">{selectedOrder.deliveryInfo.fullName}</p>
                                        <p className="text-sm">{selectedOrder.deliveryInfo.email}</p>
                                        <p className="text-sm">{selectedOrder.deliveryInfo.address}</p>
                                        <p className="text-sm">{selectedOrder.deliveryInfo.phone}</p>
                                    </div>
                                    <div>
                                        <h4 className="font-medium mb-2">Order Info</h4>
                                        <p className="text-sm">Order ID: {selectedOrder._id}</p>
                                        <p className="text-sm">Date: {new Date(selectedOrder.createdAt).toLocaleString()}</p>
                                    </div>
                                    <div>
                                        <h4 className='font-medium'>Notes:</h4>
                                        <p>delivery charge will be 40 Rs</p>
                                        <p>express delivery charge will be 60 Rs</p>
                                    </div>
                                    <div>
                                        <h4 className="font-medium mb-2">Status</h4>
                                        <p className="px-3 py-2 rounded-full text-xs font-semibold bg-zinc-500 text-white">{selectedOrder.status}</p>
                                    </div>
                                </div>

                                <div>
                                    <h4 className="font-medium mb-2">Products</h4>
                                    <div className="space-y-2 px-3 h-[14vh] [&::-webkit-scrollbar]:w-1
                                [&::-webkit-scrollbar-track]:bg-transparent
                                [&::-webkit-scrollbar-thumb]:bg-gray-800/50
                                [&::-webkit-scrollbar-thumb]:rounded-full overflow-y-auto">
                                        {selectedOrder.products.map((product, idx) => (
                                            <div key={idx} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                                                <span className="text-sm">{product.name || product.productName}</span>
                                                <span className="text-sm">₹{product.price} × {product.quantity}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="border-t pt-4">
                                    <p className="text-lg text-right font-light">
                                        Sub-Total: ₹{selectedOrder.totalAmount - 40}
                                    </p>
                                    <div className="flex justify-end">
                                        <p className="text-lg font-medium">
                                            Total: ₹{selectedOrder.totalAmount}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

OrderHistory.propTypes = {
    order: PropTypes.shape({
        createdAt: PropTypes.string.isRequired,  // Ensure it's a string (or Date)
        deliveryInfo: PropTypes.shape({
            fullName: PropTypes.string.isRequired,
            email: PropTypes.string.isRequired,
            contact: PropTypes.string.isRequired,
            address: PropTypes.string.isRequired,
            city: PropTypes.string.isRequired,
            pincode: PropTypes.string.isRequired
        }).isRequired,
        products: PropTypes.arrayOf(
            PropTypes.shape({
                productName: PropTypes.string.isRequired,  // Adjust according to product properties
                quantity: PropTypes.number.isRequired,
                price: PropTypes.number.isRequired
            })
        ).isRequired,
        totalAmount: PropTypes.number.isRequired,
    }).isRequired
};


export default OrderHistory;