import { useEffect, useState } from "react";
import { useLocation, useSearchParams, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import QRCode from "qrcode";
import StepProgress from "../../components/StepProgress";
import axios from "axios";
import { isAuthenticated } from "../../api/axios";
import '../../css files/ALLanimation.css'

function PaymentPage() {
  const [qrCode, setQrCode] = useState("");
  const [selectedPayment, setSelectedPayment] = useState("");
  const [loading, setLoading] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [enteredUpiId, setEnteredUpiId] = useState(""); // Add this
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const orderData = location.state?.orderData;
  const totalAmount = searchParams.get("amount");
  const upiId = "lakshitverma98@okicici";

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/');
    }
  }, [navigate]);

  useEffect(() => {
    if (!totalAmount || !orderData) {
      navigate("/");
    }
    generateQRCode();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [totalAmount, orderData, navigate]);

  const generateQRCode = async () => {
    if (!totalAmount) return;
    const upiLink = `upi://pay?pa=${upiId}&pn=GoMart&am=${totalAmount}&cu=INR`;
    try {
      const qr = await QRCode.toDataURL(upiLink);
      setQrCode(qr);
    } catch (err) {
      console.error("Error generating QR Code:", err);
      toast.error("Failed to generate QR code");
    }
  };

  const handlePayment = async () => {
    if (!selectedPayment) {
      toast.error("Please select a payment method");
      return;
    }

    if (selectedPayment === "upi" && !enteredUpiId) {
      toast.error("Please enter your UPI ID");
      return;
    }
    setLoading(true);

    const paymentInfo = {
      mode: selectedPayment,
      upiId: selectedPayment === "upi" ? enteredUpiId : null,
    };

    const orderPayload = {
      ...orderData,
      paymentInfo,
      totalAmount,
    };

    //   try {
    //     const response = await fetch("http://localhost:5000/api/create-order", {
    //       method: "POST",
    //       headers: { "Content-Type": "application/json" },
    //       body: JSON.stringify(orderPayload),
    //     });

    //     if (response.ok) {
    //       toast.success("Order placed successfully!");
    //       navigate("/conformation", {
    //         state: {
    //           paymentMode: selectedPayment,
    //           totalAmount: totalAmount,
    //           upiId: selectedPayment === "upi" ? enteredUpiId : null,
    //           orderDetails: orderPayload
    //       }}
    //     );
    //     } else {
    //       const errorData = await response.json();
    //       toast.error(`Error: ${errorData.error}`);
    //     }
    //   } catch (error) {
    //     toast.error("Failed to process payment. Please try again.");
    //   }
    // };

    try {
      const response = await axios.post("http://localhost:5000/api/create-order", orderPayload);

      if (response.status === 201) {
        toast.success("Order placed successfully!");
        navigate("/conformation", {
          state: {
            paymentMode: selectedPayment,
            totalAmount,
            upiId: selectedPayment === "upi" ? enteredUpiId.trim() : null,
            orderDetails: orderPayload,
          },
        });
      } else {
        toast.error("Failed to process payment. Please try again.");
      }
    } catch (error) {
      console.error("Payment error:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen font-outfit py-8 px-4">
      <ToastContainer />
      <StepProgress currentStep={2} />
      <div className="w-full max-w-4xl mx-auto border-2 border-gray-200/40 bg-white/10 backdrop-blur-md rounded-2xl shadow-xl overflow-hidden">
        <div className="flex flex-col lg:flex-row">
          {/* Payment Section - Left Side */}
          <div className="w-full lg:w-7/12 p-6">
            <h2 className="anime text-2xl font-bold mb-2 text-center text-gray-800">Complete Payment</h2>
            {/* Payment Methods */}
            <div className="space-y-3">
              <div className="space-y-4">
                <h3 className="anime font-semibold text-center text-gray-700">Select Payment Method</h3>
                <div className="anime space-y-3">
                  <label className="flex items-center p-2 border border-gray-200/50 rounded-xl cursor-pointer 
                                 hover:border-blue-500/50 hover:bg-blue-50/10 transition-all duration-300">
                    <input
                      type="radio"
                      name="payment"
                      value="upi"
                      checked={selectedPayment === "upi"}
                      onChange={(e) => setSelectedPayment(e.target.value)}
                      className="w-3 h-3 text-blue-600 border-gray-300 focus:ring-blue-500"
                    />
                    <span className="anime ml-3 text-gray-700">UPI Payment</span>
                  </label>

                  <label className="flex items-center p-2 border border-gray-200/50 rounded-xl cursor-pointer 
                                 hover:border-blue-500/50 hover:bg-blue-50/10 transition-all duration-300">
                    <input
                      type="radio"
                      name="payment"
                      value="cod"
                      checked={selectedPayment === "cod"}
                      onChange={(e) => setSelectedPayment(e.target.value)}
                      className="w-3 h-3 text-blue-600 border-gray-300 focus:ring-blue-500"
                    />
                    <span className="anime ml-3 text-gray-700">Cash on Delivery</span>
                  </label>
                </div>
              </div>

              {/* UPI Section with QR Code */}
              {selectedPayment === "upi" && (
                <div className="anime space-y-4 transition-all duration-300">
                  {qrCode && (
                    <div className="text-center p-4 bg-white/50 rounded-xl backdrop-blur-sm">
                      <img src={qrCode} alt="UPI QR Code"
                        className="mx-auto mb-4 max-w-[150px] transform hover:scale-105 transition-transform duration-300" />
                      <p className="text-sm text-gray-600">Scan QR code to pay ₹{totalAmount}</p>
                    </div>
                  )}
                  <input
                    type="text"
                    value={enteredUpiId}
                    onChange={(e) => setEnteredUpiId(e.target.value)}
                    placeholder="Enter your UPI ID for verification"
                    className="w-full px-4 py-3 border rounded-lg bg-gray-50/30 placeholder:text-gray-600  focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Terms Section - Right Side */}
          <div className="anime w-full lg:w-7/12 bg-gray-50/30 backdrop-blur-sm border-l border-gray-200/50">
            <div className="h-[calc(100%-140px)] overflow-y-auto scrollbar scrollbar-thin 
                           scrollbar-thumb-gray-300 scrollbar-track-transparent hover:scrollbar-thumb-gray-400">
              <div className="p-6 space-y-6 text-sm text-gray-600">
                <h3 className="text-lg font-bold text-gray-800 sticky top-0 text-center bg-gray-200/60 border rounded-full py-2">
                  Terms and Conditions
                </h3>
                <div className="h-[38vh] overflow-y-auto 
    [&::-webkit-scrollbar]:w-1.5
    [&::-webkit-scrollbar-track]:bg-transparent
    [&::-webkit-scrollbar-thumb]:bg-gray-300/50
    [&::-webkit-scrollbar-thumb]:rounded-full
    hover:[&::-webkit-scrollbar-thumb]:bg-gray-400/70
    [&::-webkit-scrollbar-thumb]:transition-colors
    [&::-webkit-scrollbar-thumb]:duration-300 ">
                  <section>
                    <h4 className="font-semibold text-gray-800 mb-2">Payment Completion</h4>
                    <p>Users must complete the payment after scanning the UPI QR code. Simply scanning without confirming payment does not complete the transaction.</p>
                  </section>

                  <section>
                    <h4 className="font-semibold text-gray-800 mb-2">Payment Verification</h4>
                    <p>Payments are verified in real-time. If payment is not received, the transaction will be considered as cash on delivery.</p>
                  </section>

                  <section>
                    <h4 className="font-semibold text-gray-800 mb-2">Fallback to Cash</h4>
                    <p>If the system does not receive confirmation of a UPI payment within 5 minutes, the transaction will automatically be marked as cash payment.</p>
                  </section>

                  <section>
                    <h4 className="font-semibold text-gray-800 mb-2">Responsibility of Payment</h4>
                    <p>It is the users responsibility to ensure that payments are correctly processed and acknowledged by their UPI provider. Any failed or incomplete transactions are not considered valid.</p>
                  </section>

                  <section>
                    <h4 className="font-semibold text-gray-800 mb-2">Transaction Discrepancy</h4>
                    <p>If a payment is initiated but not completed, users must resolve the issue with their bank or payment provider. The merchant is not liable for incomplete transactions.</p>
                  </section>

                  <section>
                    <h4 className="font-semibold text-gray-800 mb-2">Counter Payment Process</h4>
                    <p>For transactions marked as cash, users must pay the total amount in cash to receive their physical receipt or confirmation.</p>
                  </section>

                  <section>
                    <h4 className="font-semibold text-gray-800 mb-2">Finality of Transactions</h4>
                    <p>Payments made via UPI, once successfully processed, are non-refundable unless specifically stated by the merchants refund policy.</p>
                  </section>
                </div>
              </div>
            </div>

            {/* Checkbox and Button Section */}
            <div className="p-6 border-t border-gray-200/50 bg-white/30 backdrop-blur-sm">
              <label className="flex items-start space-x-3 group cursor-pointer">
                <div className="relative flex items-start">
                  <input
                    type="checkbox"
                    checked={acceptedTerms}
                    onChange={(e) => setAcceptedTerms(e.target.checked)}
                    className="w-5 h-5 rounded border-gray-300 text-blue-600 
                             focus:ring-blue-500 transition-colors duration-200"
                  />
                </div>
                <span className="text-sm text-gray-600 group-hover:text-gray-800 transition-colors duration-200">
                  I have read and agree to the payment terms and conditions
                </span>
              </label>

              <button
                onClick={handlePayment}
                disabled={loading || !selectedPayment || !acceptedTerms}
                className="w-full mt-4 bg-orange-600 text-white py-3 rounded-xl 
                         hover:text-black disabled:opacity-50 disabled:cursor-not-allowed 
                         transform hover:scale-[1.02] active:scale-[0.98] 
                         transition-all duration-200"
              >
                {loading ? "Processing..." : "Confirm Payment"}
              </button>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}

export default PaymentPage;
