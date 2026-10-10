import { useNavigate, useLocation } from 'react-router-dom';
import { PDFDownloadLink, Document, Page, Text, View, StyleSheet, Font } from '@react-pdf/renderer';
import StepProgress from '../../components/StepProgress';
import { isAuthenticated } from '../../api/axios';
import { useEffect } from 'react';
import '../../css files/ALLanimation.css';

// Register Custom Font for Better Styling
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

function Conformation() {
  const navigate = useNavigate();
  const location = useLocation();
  const { orderDetails } = location.state || {};

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/');
    }
  }, [navigate]);

  if (!orderDetails) {
    navigate('/');
    return null;
  }

  const orderData = orderDetails;
  const paymentMode = orderData.paymentInfo.mode;

  //Fix: Convert InvoicePDF to JSX Element inside `PDFDownloadLink`
  const InvoicePDF = (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header - Company Info */}
        <View style={styles.header}>
          <Text style={styles.title}>GoMart</Text>
          <Text style={styles.subTitle}>E-Commerce Shopping</Text>
          <Text style={styles.subTitle}>www.gomart.com | support@gomart.com</Text>
        </View>

        {/* Invoice Details */}
        <View style={styles.section}>
          <Text style={styles.label}>
            Invoice Date:{' '}
            <Text style={styles.text}>
              {orderData.createdAt ? new Date(orderData.createdAt).toLocaleDateString() : new Date().toLocaleDateString()}
            </Text>
          </Text>
        </View>

        {/* Customer Details */}
        <View style={styles.section}>
          <Text style={styles.label}>Customer Details:</Text>
          <Text style={styles.text}>Name: {orderData.deliveryInfo.fullName}</Text>
          <Text style={styles.text}>Email: {orderData.deliveryInfo.email}</Text>
          <Text style={styles.text}>Contact: {orderData.deliveryInfo.contact}</Text>
          <Text style={styles.text}>Address: {orderData.deliveryInfo.address}, {orderData.deliveryInfo.city}, {orderData.deliveryInfo.pincode}</Text>
        </View>

        {/* Product Table */}
        <View style={styles.section}>
          <Text style={styles.label}>Product Details:</Text>
          <View style={styles.tableHeader}>
            <Text style={styles.tableCell}>Product</Text>
            <Text style={styles.tableCell}>Qty</Text>
            <Text style={styles.tableCell}>Price</Text>
            <Text style={styles.tableCell}>Total</Text>
          </View>
          {orderData.products.map((product, index) => (
            <View style={styles.tableRow} key={index}>
              <Text style={styles.tableCell}>{product.name || product.productName}</Text>
              <Text style={styles.tableCell}>{product.quantity}</Text>
              <Text style={styles.tableCell}>₹{product.price}</Text>
              <Text style={styles.tableCell}>₹{product.quantity * product.price}</Text>
            </View>
          ))}
        </View>

        {/* Totals */}
        <View style={styles.totals}>
          <Text>Total Amount: ₹{orderData.totalAmount}</Text>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text>Thank you for shopping with GoMart!</Text>
          <Text>For support, contact: support@gomart.com</Text>
        </View>
      </Page>
    </Document>
  );

  return (
    <div className='p-8'>
      <StepProgress currentStep={3} />
      <div className="anime flex font-outfit justify-center items-center">
        <div className="w-full max-w-2xl border-2 border-gray-200/40 bg-white/10 backdrop-blur-md rounded-2xl shadow-xl p-8 ">
          <div className="text-center">
            <div className="text-green-500 mb-4">
              <i className="anime fas fa-check-circle text-6xl"></i>
            </div>
            <h2 className="anime text-2xl font-light mb-4">
              {paymentMode === 'cod' ? 'Order Confirmed!' : 'Payment Successful!'}
            </h2>

            <p className="anime text-gray-800 mb-8">
              {paymentMode === 'cod'
                ? 'Your order has been successfully placed and will be processed soon.'
                : 'Your order has been successfully placed and confirmed.'}
            </p>

            <div className="anime bg-white/20 backdrop-blur-sm rounded-xl p-6 mb-8">
              <h3 className="anime text-xl font-light mb-4">Order Summary</h3>
              <div className="space-y-2 text-sm">
                <div className="anime flex justify-center gap-2 font-semibold ">
                  <span>Payment Mode:</span>
                  <span>{orderData.paymentInfo.mode}</span>
                </div>
                {orderData.paymentInfo.mode === 'upi' && (
                  <div className="anime flex justify-center gap-2">
                    <span>UPI ID:</span>
                    <span>{orderData.paymentInfo.upiId}</span>
                  </div>
                )}
                <div className="anime flex justify-center gap-2 font-semibold">
                  <span>Total Amount:</span>
                  <span>₹{orderData.totalAmount}</span>
                </div>
              </div>
            </div>

            <div className="anime flex gap-4 justify-center">
              <PDFDownloadLink
                document={InvoicePDF}
                fileName="GoMart-Invoice.pdf"
                className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg
                         hover:bg-blue-700 transition-colors duration-300"
              >
                {({ loading }) =>
                  loading ? 'Generating PDF...' : (
                    <>
                      <i className="fas fa-download mr-2"></i>
                      Download Invoice
                    </>
                  )
                }
              </PDFDownloadLink>

              <button
                onClick={() => navigate('/homepage')}
                className="px-6 py-3 bg-gray-600 text-white rounded-lg
                         hover:bg-gray-700 transition-colors duration-300"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Conformation;
