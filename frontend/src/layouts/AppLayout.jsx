import { Outlet } from "react-router-dom";
import Header from "../UI/Header.jsx";
import Footer from "../UI/Footer.jsx";
import { Toaster } from "react-hot-toast";

const AppLayout = () => {
  return (
    <div className="grid grid-rows-[auto_1fr_auto] min-h-screen">
      <Header />
      
      {/* Toast notifications container */}
      <Toaster position="top-right" reverseOrder={false} />

      <Outlet />
      <Footer />
    </div>
  );
};

export default AppLayout;
