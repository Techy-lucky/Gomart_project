import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { GoogleOAuthProvider } from '@react-oauth/google';
import { useState, useEffect } from 'react'; 
import Welcome from "./files/welcome/Welcome";
import Unknown from "./files/admin/Unknown";
import Adminregist from "./files/admin/Adminregist";
import Navbar from "./files/user/Navbar";  // Changed casing to match file system
import Homepage from "./files/user/Homepage";
import PageNotFound from "./files/welcome/PageNotFound";
import Uregister from "./files/user/Uregister";
import Ulogin from "./files/user/Ulogin";
import Adminlogin from "./files/admin/Adminlogin";
import Adminhome from "./files/admin/Adminhome";
import Profile from "./files/user/Profile";
import Cart from "./files/user/Cart";
import Adminnavbar from "./files/admin/Adminnavbar";
import Adminprofile from "./files/admin/Adminprofile";
import Productupload from "./files/admin/Productupload";
import Aboutus from "./files/user/Aboutus";
import Feedback from "./files/user/Feedback";
import PosterUpload from "./files/admin/PosterUpload";
import Posterview from "./files/admin/Posterview";  
import Productview from "./files/admin/Productview";
import Search from "./files/user/Search";
import ElectronicsPage from "./files/user/ElectronicsPage";
import FashionPage from "./files/user/FashionPage";
import HomeLiving from "./files/user/Homeliving";
import Books from "./files/user/Books";
import Sports from './files/user/Sports_outdoor';
import Health from './files/user/Health_beauty';
import Toys from './files/user/Toys_games';
import Groceries from './files/user/Groceries';
import Pets from './files/user/Pet_supply';
import Stationary from './files/user/Stationary';
import Snacks from './files/user/Snacks';
import Readmore from "./files/user/Readmore";
import Allproduct from "./files/user/Allproduct";
import Processpage from "./files/user/Processpage";
import PaymentPage from "./files/payment/PaymentPage";
import Conformation from "./files/payment/Conformation";
import Userview from "./files/admin/Userview";
import Allorder from "./files/admin/Allorder";
import Job from "./files/job/Job";
import Resume from "./files/admin/Resume";
import OrderHistory from "./files/user/OrderHistory";
import Setting from "./files/user/Setting";
import Adminsetting from "./files/admin/Adminsetting";
import Compare from "./files/user/Compare";
import AIChat from "./files/AI/AIChat";
import "./App.css";
import Loader from '../src/components/Loader';
import { UserProvider } from "./files/user/UserContext";


function NavbarWrapper() {
  const location = useLocation();
  const hideNavbarPaths = ['/', '/unknown', '/adminregister', '/adminlogin', '/register', '/login'];
  const currentPath = location.pathname;
  
  // Hide navbar for specified paths and any unknown routes (404)
  if (hideNavbarPaths.includes(currentPath) || !(['/homepage', '/cart', '/profile', '/about', '/feedback','/search','/allproducts','/setting','/aichat','/compare'].includes(currentPath))) {
    return null;
  }

  return <Navbar />;
}

function AdminNavbarWrapper() {
  const location = useLocation();
  const showAdminNavbarPaths = ['/admindashboard', '/adminprofile', '/adminproductupload', '/adminposterupload', '/adminposterview', '/adminproductview','/adminuserview','/adminallorder','/adminresume','/adminsetting'];
  const currentPath = location.pathname;

  // Only show admin navbar for admin dashboard
  if (!showAdminNavbarPaths.includes(currentPath)) {
    return null;
  }

  return <Adminnavbar />;
}

// eslint-disable-next-line react/prop-types
function AdminContentWrapper({ children }) {
  const location = useLocation();
  const isAdminPage = ['/admindashboard', '/adminprofile', '/adminproductupload', '/adminposterupload', '/adminposterview', '/adminproductview','/adminuserview','/adminallorder','/adminresume','/adminsetting'].includes(location.pathname);

  if (isAdminPage) {
    return <div className="pl-[276px]">{children}</div>;
  }

  return children;
}

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 700); // Show loader for 1 seconds

    return () => clearTimeout(timer);
  }, []);

  return (
    <GoogleOAuthProvider clientId="137441948802-u3aq2e3ebrvdq664i0mg1ugj0mo338lr.apps.googleusercontent.com">
      <BrowserRouter>
        {loading ? (
          <Loader />
        ) : (
          <>
            <NavbarWrapper />
            <AdminNavbarWrapper />
            <AdminContentWrapper>
            <UserProvider>
              <Routes className="font-outfit">
                <Route path="/" element={<Welcome />} />
                <Route path="/unknown" element={<Unknown />} />
                <Route path="/adminregister" element={<Adminregist />} />
                <Route path="/homepage" element={<Homepage />} />
                <Route path="/register" element={<Uregister />} />
                <Route path="/login" element={<Ulogin />} />
                <Route path="/adminlogin" element={<Adminlogin />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/admindashboard" element={<Adminhome />} />
                <Route path="/adminprofile" element={<Adminprofile />} />
                <Route path="/adminproductupload" element={<Productupload />} />
                <Route path="/about" element={<Aboutus />} />
                <Route path="/feedback" element={<Feedback />} />
                <Route path="/adminposterupload" element={<PosterUpload />} />
                <Route path="/adminposterview" element={<Posterview />} />
                <Route path="/adminproductview" element={<Productview />} />
                <Route path="/search" element={<Search />} />
                <Route path="/products/electronics" element={<ElectronicsPage />} />
                <Route path="/products/fashion" element={<FashionPage />} />
                <Route path="/products/homeliving" element={<HomeLiving />} />
                <Route path="/products/books" element={<Books />} />
                <Route path="/products/sports" element={<Sports />} />
                <Route path="/products/health_beauty" element={<Health />} />
                <Route path="/products/toys_games" element={<Toys />} />
                <Route path="/products/groceries" element={<Groceries />} />
                <Route path="/products/pets_supplies" element={<Pets />} />
                <Route path="/products/stationary" element={<Stationary />} />
                <Route path="/products/snacks" element={<Snacks />} />
                <Route path="/product/:id" element={<Readmore />} />
                <Route path="/allproducts" element={<Allproduct />} />
                <Route path="/processpage" element={<Processpage />} />
                <Route path="/payment" element={<PaymentPage />} />
                <Route path="/conformation" element={<Conformation />} />
                <Route path="/adminUserview" element={<Userview />} />
                <Route path="/adminallorder" element={<Allorder />} />
                <Route path="/job" element={<Job />} />
                <Route path="/adminresume" element={<Resume />} />
                <Route path="/orderhistory" element={<OrderHistory />} />
                <Route path="/setting" element={<Setting />} />
                <Route path="/aichat" element={<AIChat />}></Route>
                <Route path="/compare" element={<Compare />}></Route>
                <Route path="/adminsetting" element={<Adminsetting />}></Route>
                <Route path="*" element={<PageNotFound />} />
              </Routes>
              </UserProvider>
            </AdminContentWrapper>
          </>
        )}
      </BrowserRouter>
    </GoogleOAuthProvider>
  );
}

export default App;
