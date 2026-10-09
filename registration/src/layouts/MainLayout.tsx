import type { ReactNode } from 'react';
import { motion } from 'framer-motion';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import Footer from '../components/Footer';

interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <div className="flex min-h-screen flex-col bg-hackathon-black text-hackathon-white">
      <Header />

      {/* Main content area with sidebar */}
      <div className="flex flex-1">

        {/* comments donntmake sense  here cuz taken from the full site */}
        {/* Content area with background and scroll */}
        <div className="relative flex-1 mt-[6rem]">
          {/* Background Image */}
          <div
            className="moon-bg fixed inset-0 z-0 bg-cover bg-center bg-no-repeat opacity-45"
            style={{ backgroundImage: 'url("/blackhole-bg.png")' }}
          />

          {/* Scrollable content */}
          <div className="relative z-10 min-h-[calc(100vh-4rem)] px-6">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              {children}
            </motion.div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default MainLayout;
