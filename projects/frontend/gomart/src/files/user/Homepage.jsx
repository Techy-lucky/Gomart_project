// import { useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { isAuthenticated } from '../../api/axios';
// import Imgslider from "./Imgslider";
// import Prodcategory from "./Prodcategory";
// import Electronic from "./Electronic";
// import Fashion from "./Fashion";
// import Showfeed from './Showfeed';
// import Footer from './Footer';
// import Card from './Card';
// import '../../css files/homepage.css';

// const Homepage = () => {
//   const navigate = useNavigate();

//   useEffect(() => {
//     if (!isAuthenticated()) {
//       navigate('/');
//     }
//   }, [navigate]);

//   return (
//     <>
//       <div name="homepage-container" className="mx-4 mt-4 pl-1 pr-1 font-outfit h-screen overflow-y-auto scroll-smooth
//         [&::-webkit-scrollbar]:w-2
//         [&::-webkit-scrollbar-track]:bg-transparent 
//         [&::-webkit-scrollbar-thumb]:bg-gray-400/50 rounded-xl">
//         <div name="content-wrapper" className="flex flex-col gap-4  animate-fade-in">
//           <div name="main-content" className="flex flex-row gap-4">
//             <Prodcategory />
//             <Imgslider />
//           </div>
//           <Card />
//           <Electronic />
//           <Fashion />
//         </div>
//         <Showfeed />
//         <Footer />
//       </div>
//     </>
//   );
// };

// export default Homepage;

import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { isAuthenticated } from "../../api/axios";
import Imgslider from "./Imgslider";
import Prodcategory from "./Prodcategory";
import Electronic from "./Electronic";
import Fashion from "./Fashion";
import Showfeed from "./Showfeed";
import Footer from "./Footer";
import Card from "./Card";
import { motion } from "framer-motion";
import "../../css files/homepage.css";

const Homepage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate("/");
    }
  }, [navigate]);

  // **Smooth Fade & Slide Animation**
  const fadeInUp = {
    hidden: { opacity: 1, y: 50 }, // Start lower for smoother effect
    visible: {
      opacity: 2,
      y: 0,
      transition: { duration: 0.5, ease: "easeInOut" } // Slower transition
    },
  };

  return (
    <>
      <div
        name="homepage-container"
        className="mx-4 mt-4 pl-1 pr-1 font-outfit h-screen overflow-y-auto scroll-smooth
        [&::-webkit-scrollbar]:w-2
        [&::-webkit-scrollbar-track]:bg-transparent 
        [&::-webkit-scrollbar-thumb]:bg-gray-400/50 rounded-xl"
      >
        <motion.div
          name="content-wrapper"
          className="flex flex-col gap-6"
          initial="hidden"
          animate="visible"
          transition={{ staggerChildren: 0.2 }} // Smooth delay between sections
        >
          {/* Top Section (Categories & Slider) */}
          <motion.div
            name="main-content"
            className="flex flex-row gap-4"
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false }}
          >
            <Prodcategory />
            <Imgslider />
          </motion.div>

          {/* Cards Section */}
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false }}
          >
            <Card />
          </motion.div>

          {/* Electronics Section */}
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false }}
          >
            <Electronic />
          </motion.div>

          {/* Fashion Section */}
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false }}
          >
            <Fashion />
          </motion.div>

        </motion.div>

        {/* Feed & Footer */}
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false }}
        >
          <Showfeed />
        </motion.div>
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false }}
        >
          <Footer />
        </motion.div>
      </div>
    </>
  );
};

export default Homepage;
