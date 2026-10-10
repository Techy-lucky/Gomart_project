import { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axios from "../../api/axios";
import "react-toastify/dist/ReactToastify.css";
import "../../css files/feedback.css";

const Feedback = () => {
    const [user, setUser] = useState({ fullName: "", email: "" });
    const [rating, setRating] = useState(0);
    const [hover, setHover] = useState(0);
    const [feedback, setFeedback] = useState("");
    const navigate = useNavigate();

    // Fetch user profile data
    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) {
                    toast.error("Please login first.");
                    navigate("/");
                    return;
                }

                const response = await axios.get("/profile", {
                    headers: { Authorization: `Bearer ${token}` },
                });

                if (response.data) {
                    setUser({
                        fullName: response.data.fullName || "N/A",
                        email: response.data.email || "N/A",
                    });
                }
            } catch (error) {
                console.error("Error fetching user profile:", error);
                toast.error("Session expired. Please login again.");
                navigate("/");
            }
        };

        fetchUserProfile();
    }, [navigate]);

    // Handle feedback submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!user.fullName || !user.email || rating === 0 || !feedback.trim()) {
            toast.error("Please fill all fields and select a rating.");
            return;
        }

        try {
            const response = await axios.post("/api/feedback", {
                userName: user.fullName,
                userEmail: user.email,
                rating,
                feedback,
            });

            if (response.data.success) {
                toast.success("Feedback submitted successfully!");
                setRating(0);
                setFeedback("");
            }
        } catch (error) {
            console.error("Submit error:", error);
            toast.error("Failed to submit feedback.");
        }
    };

    return (
        <div className="feedback-container bg-white/20 border-2 border-gray-200/40 backdrop-blur-md rounded-xl w-[97%] h-[83vh] mx-auto font-outfit mt-5 p-6">
            <h2 className="feedback-title text-2xl font-light text-center mb-6">Share Your Feedback</h2>

            <form onSubmit={handleSubmit} className="feedback-form max-w-2xl mx-auto">
                {/* User Full Name */}
                <div className="feedback-form__group mb-6">
                    <input
                        type="text"
                        value={user.fullName}
                        readOnly
                        className="feedback-form__input w-full p-3 rounded-lg outline-none bg-white/50"
                        placeholder="Your Name"
                    />
                </div>

                {/* User Email */}
                <div className="feedback-form__group mb-6">
                    <input
                        type="email"
                        value={user.email}
                        readOnly
                        className="feedback-form__input w-full p-3 rounded-lg outline-none bg-white/50"
                        placeholder="Your Email"
                    />
                </div>

                {/* Feedback Input */}
                <div className="feedback-form__group mb-6">
                    <textarea
                        value={feedback}
                        onChange={(e) => setFeedback(e.target.value)}
                        placeholder="Your Feedback"
                        rows="4"
                        className="feedback-form__textarea w-full p-3 rounded-lg outline-none bg-white/50"
                    />
                </div>

                {/* Star Rating */}
                <div className="feedback-form__rating mb-4">
                    <h3 className="feedback-form__label text-center text-sm mb-2">Rate Your Experience</h3>
                    <div className="feedback-form__stars flex justify-center gap-2">
                        {[...Array(5)].map((_, index) => {
                            const ratingValue = index + 1;
                            return (
                                <button
                                    key={index}
                                    type="button"
                                    className={`feedback-form__star text-4xl transition-transform ${ratingValue <= (hover || rating) ? "text-yellow-400" : "text-gray-300"
                                        }`}
                                    onClick={() => setRating(ratingValue)}
                                    onMouseEnter={() => setHover(ratingValue)}
                                    onMouseLeave={() => setHover(rating)}
                                >
                                    ★
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    className="feedback-form__submit w-full bg-blue-600 text-white py-3 rounded-lg"
                >
                    Submit Feedback
                </button>
            </form>

            <ToastContainer />
        </div>
    );
};

export default Feedback;
