import { useState, useEffect } from "react";
import '../../css files/ALLanimation.css'

const Imgslider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [allSlides, setAllSlides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showSlider, setShowSlider] = useState(false); // For animation

  useEffect(() => {
    const fetchPosters = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/posters", {
          method: "GET",
          credentials: "include",
        });
        const posters = await response.json();

        const posterUrls = posters.map((poster) => poster.imageUrl);
        setAllSlides(posterUrls);
        setLoading(false);

        // Show slider after loading (for animation effect)
        setTimeout(() => setShowSlider(true), 200);
      } catch (error) {
        console.error("Error fetching posters:", error);
        setLoading(false);
      }
    };

    fetchPosters();
  }, []);

  useEffect(() => {
    if (allSlides.length === 0) return;

    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev === allSlides.length - 1 ? 0 : prev + 1));
    }, 3500);

    return () => clearInterval(timer);
  }, [allSlides.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === allSlides.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? allSlides.length - 1 : prev - 1));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[525px] text-gray-50/10">
        Loading...
      </div>
    );
  }

  if (allSlides.length === 0) {
    return (
      <div className="flex items-center justify-center h-[525px] text-gray-500">
        No images available.
      </div>
    );
  }

  return (
    <div
      className={`anime font-outfit backdrop-blur-md border-2 border-gray-200/40 bg-white/10 p-4 rounded-xl shadow-lg w-screen h-[83vh] overflow-hidden relative
        transition-transform duration-700 ease-out ${showSlider ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
        }`}
    >
      <div className="anime relative w-full h-[80vh] overflow-hidden rounded-xl">
        {allSlides.map((slide, index) => (
          <img
            key={index}
            src={slide}
            alt={`Slide ${index + 1}`}
            className={`anime absolute w-full h-[78vh] rounded-lg object-cover transition-opacity duration-500 ${index === currentSlide ? "opacity-100" : "opacity-0"
              }`}
            onError={(e) => console.error("Image load error:", e)}
          />
        ))}

        <div className="anime absolute bottom-8 right-4 flex gap-2">
          <button
            onClick={prevSlide}
            className="px-5 py-2 rounded-full border border-black  bg-white text-black hover:bg-black hover:text-white transition-all"
          >
            {/* ←  */}
            Pre
          </button>
          <button
            onClick={nextSlide}
            className="px-4 py-2 rounded-full border border-black bg-black text-white hover:bg-white hover:text-black transition-all"
          >
            {/* →  */}
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default Imgslider;
