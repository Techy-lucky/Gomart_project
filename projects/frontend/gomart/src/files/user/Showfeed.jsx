import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

const Showfeed = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  const fetchFeedbacks = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/feedbacks');
      const data = await response.json();
      console.log('Fetched feedbacks:', data);
      if (data.success) {
        setFeedbacks(data.feedbacks);
      }
    } catch (error) {
      console.error('Fetch error:', error);
      toast.error('Failed to load feedbacks');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-8 px-4">
      <h2 className="text-2xl font-bold mb-8  text-center">What Our Customers Say</h2>

      {loading ? (
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-500 border-t-transparent"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 " style={{ maxHeight: '70vh' }}>
          {feedbacks.map((feedback, index) => (
            <div
              key={index}
              className="bg-white/20 backdrop-blur-md rounded-xl p-6 shadow-lg 
                       border-2 border-gray-200/40 hover:bg-white/30 transition-all 
                       duration-300 hover:-translate-y-1"
            >
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 
                              flex items-center justify-center text-white font-bold text-lg
                              shadow-md">
                  {feedback.userName?.charAt(0).toUpperCase() || '?'}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-800">{feedback.userName}</h3>
                  <div className="flex space-x-1 text-yellow-400 my-1">
                    {[...Array(feedback.rating)].map((_, i) => (
                      <span key={i} className="text-lg">★</span>
                    ))}
                  </div>
                  <p className="text-sm text-gray-900 mt-2">{feedback.feedback}</p>
                  <p className="text-xs text-gray-900 mt-3">
                    {new Date(feedback.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Showfeed;