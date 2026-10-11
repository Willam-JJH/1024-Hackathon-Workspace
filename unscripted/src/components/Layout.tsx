import { Outlet } from "react-router-dom";
import TopNav from "./TopNav";
import Footer from "./Footer";
import ScrollToTop from "./ScrollToTop";

const Layout = () => (
  <div className="flex min-h-[100dvh] flex-col bg-black">
    <ScrollToTop />
    <TopNav />
    <main className="flex-1">
      <Outlet />
    </main>
    <Footer />
  </div>
);

export default Layout;
