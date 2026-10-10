import { useState, useEffect } from "react";
import axios from "axios";
import AI from '../../video/VID-20250108-WA0005.mp4';
import { isAuthenticated } from '../../api/axios';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../../css files/ALLanimation.css';
import Loading from '../../images/icon/loading-01-stroke-rounded.svg';
// import gif from '../../gif/via GIPHY.gif'

function AIChat() {
  const [question, setQuestion] = useState("");
  const [responses, setResponses] = useState([]);
  const [products, setProducts] = useState([]); // Store product data
  const [loading, setLoading] = useState(false); // Loading state
  const navigate = useNavigate();

  const predefinedQA = {
    "what is my website name": "GoMart",
    "what is the website name": "GoMart",
    "how many owner are there": "3",
    "what is your name": "my owner like to call me rose",
    "give me the detail of this website": "this is a e-commerce website \n GoMart is the name of this website \n-> there are three owner of this website:\n> Lakshit . N . Varma\n> Prahlad . M . Vishwakarma\n> Ayush . H . Fataniya\n-> there are some feature of website : \n> its has user friendly view\n>provide theme customization\n>give job to person\n>has currently 164 product list\n>provide fast google signup \n> provide express delivery option and many more .",
    "why your name is rose": "because the rose has a beautifull in nature and has a spick also in bottom \n so do not understand me normal i am special to my owner",
    "why your owner call you rose": "because the rose has a beautifull in nature and has a spick also in bottom \n so do not understand me normal i am special to my owner",
    "who are they": "The owner are :\n> Lakshit . N . Varma\n> Prahlad . M . Vishwakarma\n> Ayush . H . Fataniya",
    "what are the owner name": "There are currently three owners:\n> Lakshit . N . Varma\n> Prahlad . M . Vishwakarma\n> Ayush . H . Fataniya",
    "what the owner name": "There are currently three owners:\n> Lakshit . N . Varma\n> Prahlad . M . Vishwakarma\n> Ayush . H . Fataniya",
    "what is the owner name": "There are currently three owners:\n> Lakshit . N . Varma\n> Prahlad . M . Vishwakarma\n> Ayush . H . Fataniya",
    "do you have an online store": "Yes! You can browse and order products online through our GoMart website."
  };

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/');
    }
    fetchProducts(); // Load product data when chat opens
  }, [navigate]);

  async function fetchProducts() {
    try {
      const res = await axios.get("http://localhost:5000/products");
      if (res.data.success) {
        setProducts(res.data.products);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  }

  async function generateAnswer() {
    if (!question.trim()) return;
    setLoading(true); // Start loading
    const normalizedQuestion = question.trim().toLowerCase();

    //Check predefined questions first
    if (predefinedQA[normalizedQuestion]) {
      setResponses(prev => [...prev, { question, answer: predefinedQA[normalizedQuestion] }]);
      setQuestion("");
      setLoading(false);
      return;
    }

    try {
      console.log("Loading AI response...");

      let messageToAI = `User Question: ${question}`;

      //Only include product data for relevant queries
      const productKeywords = ["price", "buy", "available", "stock", "product", "category"];
      const isProductQuestion = productKeywords.some(keyword => normalizedQuestion.includes(keyword));

      if (isProductQuestion && products.length > 0) {
        const productInfo = products.map(p =>
          `Product: ${p.name}, Category: ${p.category}, Price: ₹${p.price}, Description: ${p.description}`
        ).join("\n");
        messageToAI = `Here are the available products:\n${productInfo}\n\nUser Question: ${question}`;
      }

      //Send to AI
      const response = await axios.post(
        {
          contents: [{ parts: [{ text: messageToAI }] }]
        }
      );

      const answer = response?.data?.candidates?.[0]?.content?.parts?.[0]?.text || "No response received.";
      setResponses(prev => [...prev, { question, answer }]);
      setQuestion("");
    } catch (error) {
      console.error("AI API Error:", error);
      setResponses(prev => [...prev, { question, answer: "Something went wrong. Please try again!" }]);
    }
    setLoading(false);
  }

  function resetChat() {
    setQuestion("");
    setResponses([]);
  }

  function handleKeyDown(event) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      generateAnswer();
    }
  }

  function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
      toast.success("Copied to clipboard!");
    }).catch(err => {
      console.error("Failed to copy: ", err);
      toast.error("Failed to copy");
    });
  }

  return (
    <div className="relative flex font-outfit justify-center items-center h-full p-6">
      <ToastContainer />
      <video loop autoPlay muted className="absolute inset-0 w-full h-full mt-6 pb-14 mix-blend-multiply object-contain">
        <source src={AI} type="video/mp4" />
      </video>
      {/* <img src={gif} alt="gif" className="absolute inset-0 w-full h-full mt-6 pb-14 mix-blend-multiply object-contain" /> */}
      <div className="anime relative w-full  max-w-7xl p-4 border-2 border-gray-200/40 bg-white/20 rounded-3xl rounded-b-[7vh] shadow-xl">
        <h1 className="anime text-2xl text-center text-black font-light mb-4">Chat with AI</h1>

        <div className="anime h-[55vh] overflow-y-auto scroll-smooth p-3 bg-white/30 border-2 border-gray-200/40 rounded-3xl">
          {responses.map((res, index) => (
            <div key={index} className="mb-4">
              <p className="font-outfit text-white whitespace-pre-wrap border border-white bg-black/70 p-3 rounded-lg mb-2">You: {res.question}</p>
              <pre className="text-gray-700 whitespace-pre-wrap border border-black bg-gray-100 p-3 pr-12 rounded-lg relative">
                AI: {res.answer}
                <button
                  onClick={() => copyToClipboard(res.answer)}
                  className="absolute top-2.5 right-2 text-sm bg-blue-500 text-white px-2 py-1 rounded active:px-1 ">
                  Copy
                </button>
              </pre>
              <hr className="border-gray-600 mt-2" />
            </div>
          ))}
          {/* {loading && <p className="text-center text-black p-14">Thinking...</p>} */}
          {loading && (
            <div className="flex justify-center items-center p-8">
              <img src={Loading} alt="Loading..." className="w-7 h-7 animate-bounce" />
            </div>
          )}
          {responses.length === 0 && (
            <p className="anime text-black text-center text-lg p-36">No conversations yet.</p>
          )}
        </div>

        <div className="anime flex gap-2 bg-white/40 mt-5 rounded-full">
          <textarea
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask with AI"
            className="anime w-[144vh] px-4 py-2 placeholder:text-center placeholder:pl-72 pl-10 placeholder:text-black placeholder:p-3 bg-transparent rounded-full focus:outline-none resize-none 
            p-3 [&::-webkit-scrollbar]:w-2
           [&::-webkit-scrollbar-track]:bg-transparent 
           [&::-webkit-scrollbar-thumb]:bg-gray-400/50
           [&::-webkit-scrollbar-thumb]:rounded-full"
          ></textarea>
          <div className="anime flex justify-end mt-2 mb-2 gap-1">
            <button
              onClick={generateAnswer}
              disabled={loading}
              className="px-4 py-1 text-sm active:px-3 bg-orange-500 text-white border-2 border-gray-200/40 hover:bg-orange-500 hover:text-black rounded-l-full font-light transition-all"
            >
              {loading ? "Loading..." : "Generate Answer"}
            </button>
            <button
              onClick={resetChat}
              className="px-6 py-1 active:px-5 bg-red-600 border-2 border-gray-200/40 text-white hover:text-black rounded-r-full transition-all font-light text-sm"
            >
              Reset Chat
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AIChat;

