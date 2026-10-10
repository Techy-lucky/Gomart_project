import { Link, useLocation } from 'react-router-dom'
import AdminLogout from './Adminlogout'
import '../../css files/adminnav.css';
import admin from '../../images/icon/dashboard.svg';
import productupload from '../../images/icon/productupload.svg';
import productview from '../../images/icon/productview.svg';
import posterupload from '../../images/icon/posterupload.svg';
import posterview from '../../images/icon/posterview.svg';
import user from '../../images/icon/alluser.svg';
import order from '../../images/icon/allorder.svg';
import resume from '../../images/icon/resume.svg';
import profile from '../../images/icon/admin.svg';
import Setting from '../../images/icon/setting.svg';


function Adminnavbar() {
  const location = useLocation();
  const isDashboard = location.pathname === '/admindashboard';
  const isProfile = location.pathname === '/adminprofile';
  const isProductUpload = location.pathname === '/adminproductupload';
  const isProductView = location.pathname === '/adminproductview';
  const isPosterUpload = location.pathname === '/adminposterupload';
  const isPosterView = location.pathname === '/adminposterview';
  const isUserview = location.pathname === '/adminuserview';
  const isOrder = location.pathname === '/adminallorder';
  const isResume = location.pathname === '/adminresume';
  const isSetting = location.pathname === '/adminsetting';
  // const isDiscount = location.pathname === '/discount';


  return (
    <nav className="fixed left-0 top-0 h-[calc(100vh-2rem)] w-64 bg-white/20 rounded-3xl m-4 backdrop-blur-md border-r border-gray-200/40 shadow-lg font-outfit">
      <div name="navbar-container" className="flex flex-col h-full p-4">
        <div name="navbar-content" className="flex flex-col space-y-2">
          <Link
            to="/admindashboard"
            className={`text-gray-700 px-4 py-3 rounded-full text-sm font-medium flex items-center justify-center transition-colors duration-200 hover:no-underline ${isDashboard ? 'bg-gray-100/90 text-gray-900' : 'hover:text-gray-900 hover:bg-gray-100/90'
              }`}
          >
            <img src={admin} alt="admin" className="w-5 h-5 mr-3" />
            <span className="font-bold font-outfit">Dashboard</span>
          </Link>

          <Link
            to="/adminproductupload"
            className={`text-gray-700 px-4 py-3 rounded-full text-sm font-medium flex items-center justify-center transition-colors duration-200 hover:no-underline ${isProductUpload ? 'bg-gray-100/90 text-gray-900' : 'hover:text-gray-900 hover:bg-gray-100/90'
              }`}
          >
            <img src={productupload} alt="productupload" className="w-5 h-5 mr-3" />
            <span className="font-bold font-outfit">Product Upload</span>
          </Link>

          <Link
            to="/adminproductview"
            className={`text-gray-700 px-4 py-3 rounded-full text-sm font-medium flex items-center justify-center transition-colors duration-200 hover:no-underline ${isProductView ? 'bg-gray-100/90 text-gray-900' : 'hover:text-gray-900 hover:bg-gray-100/90'
              }`}
          >
            <img src={productview} alt="productview" className="w-5 h-5 mr-3" />
            <span className="font-bold font-outfit">View Products</span>
          </Link>

          <Link
            to="/adminposterupload"
            className={`text-gray-700 px-4 py-3 rounded-full text-sm font-medium flex items-center justify-center transition-colors duration-200 hover:no-underline ${isPosterUpload ? 'bg-gray-100/90 text-gray-900' : 'hover:text-gray-900 hover:bg-gray-100/90'
              }`}
          >
            <img src={posterupload} alt="posterupload" className="w-5 h-5 mr-3" />
            <span className="font-bold font-outfit">Poster Upload</span>
          </Link>
          <Link
            to="/adminposterview"
            className={`text-gray-700 px-4 py-3 rounded-full text-sm font-medium flex items-center justify-center transition-colors duration-200 hover:no-underline ${isPosterView ? 'bg-gray-100/90 text-gray-900' : 'hover:text-gray-900 hover:bg-gray-100/90'
              }`}
          >
            <img src={posterview} alt="posterview" className="w-5 h-5 mr-3" />
            <span className="font-bold font-outfit">Poster View</span>
          </Link>
          <Link to="/adminresume" className={`text-gray-700 px-4 py-3 rounded-full text-sm font-medium flex items-center justify-center transition-colors duration-200 hover:no-underline ${isResume ? 'bg-gray-100/90 text-gray-900' : 'hover:text-gray-900 hover:bg-gray-100/90'}`}>
            <img src={resume} alt="resume" className="w-5 h-5 mr-3" />
            <span className="font-bold font-outfit">All resume</span>
          </Link>
          <Link to="/adminuserview" className={`text-gray-700 px-4 py-3 rounded-full text-sm font-medium flex items-center justify-center transition-colors duration-200 hover:no-underline ${isUserview ? 'bg-gray-100/90 text-gray-900' : 'hover:text-gray-900 hover:bg-gray-100/90'}`}>
            <img src={user} alt="user" className="w-5 h-5 mr-3" />
            <span className="font-bold font-outfit">All users</span>
          </Link>
          <Link to="/adminallorder" className={`text-gray-700 px-4 py-3 rounded-full text-sm font-medium flex items-center justify-center transition-colors duration-200 hover:no-underline ${isOrder ? 'bg-gray-100/90 text-gray-900' : 'hover:text-gray-900 hover:bg-gray-100/90'}`}>
            <img src={order} alt="order" className="w-5 h-5 mr-3" />
            <span className="font-bold font-outfit">All Orders</span>
          </Link>
          <Link
            to="/adminprofile"
            className={`text-gray-700 px-4 py-3 rounded-full text-sm font-medium flex items-center justify-center transition-colors duration-200 hover:no-underline ${isProfile ? 'bg-gray-100/90 text-gray-900' : 'hover:text-gray-900 hover:bg-gray-100/90'
              }`}
          >
            <img src={profile} alt="profile" className="w-5 h-5 mr-3" />
            <span className="font-bold font-outfit">Profile</span>
          </Link>
          <Link
            to="/adminsetting"
            className={`text-gray-700 px-4 py-3 rounded-full text-sm font-medium flex items-center justify-center transition-colors duration-200 hover:no-underline ${isSetting ? 'bg-gray-100/90 text-gray-900' : 'hover:text-gray-900 hover:bg-gray-100/90'
              }`}
          >
            <img src={Setting} alt="profile" className="w-5 h-5 mr-3" />
            <span className="font-bold font-outfit">Setting</span>
          </Link>
          {/* <Link
            to="/discount"
            className={`text-gray-700 px-4 py-3 rounded-full text-sm font-medium flex items-center justify-center transition-colors duration-200 hover:no-underline ${isDiscount ? 'bg-gray-100/90 text-gray-900' : 'hover:text-gray-900 hover:bg-gray-100/90'
              }`}
          >
           <img src={Setting} alt="profile" className="w-5 h-5 mr-3" />
            <span className="font-bold font-outfit">Discount</span>
          </Link> */}
        </div>
        <div name="navigation-links" className="mt-auto flex items-center justify-center">
          <span className="font-bold font-outfit flex items-center">
            <AdminLogout />
          </span>
        </div>
      </div>
    </nav>
  )
}

export default Adminnavbar
