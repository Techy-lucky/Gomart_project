import back1 from '../../images/img/back2.jpg';
import back2 from '../../images/img/back5.jpg';
import back3 from '../../images/img/back8.jpg';
import back4 from '../../images/img/back11.jpg';
import back5 from '../../images/img/background5.jpeg';
import back6 from '../../images/img/background9.jpeg';
import back7 from '../../images/img/background11.jpeg';
import back8 from '../../images/img/background12.jpeg';
import back9 from '../../images/img/198974-final.jpg';
import back10 from '../../images/img/198993-final.png';
import back11 from '../../images/img/199085-final.jpeg';
import back12 from '../../images/img/AIFusionArt_ Free AI Image Generator.jpeg';
import back13 from '../../images/img/arseny-togulev-UlQn-6yTu3c-unsplash.jpg';
import back14 from '../../images/img/bhautik-patel-31PzqXgqO6I-unsplash.jpg';
import back15 from '../../images/img/bhautik-patel-3YphJGjvoeY-unsplash.jpg';
import back16 from '../../images/img/bhautik-patel-Q8tP0qyhsXY-unsplash.jpg';
import back17 from '../../images/img/nan-zhou-GGyX0OkBKa0-unsplash.jpg';
import back18 from '../../images/img/philip-oroni-4mc2fpA83lo-unsplash.jpg';
import back19 from '../../images/img/wil-stewart-pHANr-CpbYM-unsplash.jpg';
import back20 from '../../images/img/willian-justen-de-vasconcellos-7kCNXfo35aU-unsplash.jpg';
import '../../css files/setting.css';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { isAuthenticated } from '../../api/axios';
import { toast } from 'react-toastify';

function Setting() {
  const navigate = useNavigate();
  const [isAuth, setIsAuth] = useState(false);
  const [selectedBackground, setSelectedBackground] = useState('back8');

  useEffect(() => {
    const checkAuth = () => {
      const authenticated = isAuthenticated();
      setIsAuth(authenticated);
      if (!authenticated) {
        navigate('/');
        return;
      }
      // Only load saved background if authenticated
      const savedBg = localStorage.getItem('selectedBackground');
      if (savedBg && authenticated) {
        setSelectedBackground(savedBg);
        document.body.style.backgroundImage = `url(${backgrounds.find(bg => bg.id === savedBg).img})`;
      }
    };
    checkAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigate]);

  const handleBackgroundChange = (bgId) => {
    // Only allow changes if authenticated
    if (!isAuth) {
      toast.error('Please login to change background');
      return;
    }
    const selectedBg = backgrounds.find(bg => bg.id === bgId);
    setSelectedBackground(bgId);
    document.body.style.backgroundImage = `url(${selectedBg.img})`;
    localStorage.setItem('selectedBackground', bgId);
  };

  const backgrounds = [
    { id: 'back1', img: back1 },
    { id: 'back2', img: back2 },
    { id: 'back3', img: back3 },
    { id: 'back4', img: back4 },
    { id: 'back5', img: back5 },
    { id: 'back6', img: back6 },
    { id: 'back7', img: back7 },
    { id: 'back8', img: back8 },
    { id: 'back9', img: back9 },
    { id: 'back10', img: back10 },
    { id: 'back11', img: back11 },
    { id: 'back12', img: back12 },
    { id: 'back13', img: back13 },
    { id: 'back14', img: back14 },
    { id: 'back15', img: back15 },
    { id: 'back16', img: back16 },
    { id: 'back17', img: back17 },
    { id: 'back18', img: back18 },
    { id: 'back19', img: back19 },
    { id: 'back20', img: back20 },
  ];

  // Only render if authenticated
  if (!isAuth) return null;

  return (
    <div className="setting-container bg-white/20 border-2 border-gray-200/40 backdrop-blur-md font-outfit rounded-xl w-[97%] h-[83vh] mx-auto mt-5 p-6">
      <h2 className="setting-title text-2xl font-light text-center mb-6 text-black/90">Appearance Settings</h2>

      <div className="setting-content grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 overflow-y-auto h-[65vh] custom-scroll px-2">
        {backgrounds.map((bg) => (
          <div
            key={bg.id}
            onClick={() => handleBackgroundChange(bg.id)}
            className={`setting-card relative rounded-xl overflow-hidden cursor-pointer h-48
                               transition-all duration-300 transform hover:scale-105
                               ${selectedBackground === bg.id ? 'setting-card--active ring-4 ring-blue-500' : 'ring-1 ring-white/30'}`}
          >
            <img
              src={bg.img}
              alt={bg.id}
              className="setting-card__image w-full h-full object-cover"
            />
            <div className={`setting-card__overlay absolute inset-0 bg-gradient-to-t from-black/70 to-transparent
                                   flex items-center justify-center`}>
              <span className={`setting-card__label text-white/90 text-sm font-medium bg-black/40 px-3 py-1.5 
                                       rounded-full backdrop-blur-sm transition-all duration-300
                                       ${selectedBackground === bg.id ? 'opacity-100' : 'opacity-0 hover:opacity-100'}`}>
                {selectedBackground === bg.id ? 'Current Theme' : 'Select Theme'}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Setting