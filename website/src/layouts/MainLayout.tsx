import type { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { Suspense, useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';
import Loading from '../components/Loading';
import BinaryRain from '../components/BinaryRain';
import ScrollToTop from '../components/ScrollToTop';

interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  const location = useLocation();
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 1024);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 1024);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="text-hackathon-white">
      <ScrollToTop />
      {/* content container */}

      <Header />

      {/* Scroll wrapper */}
      <div className="overflow-y-scroll h-[100dvh] relative z-0 overscroll-none" style={{
        scrollBehavior: 'auto'
      }}>

        <Sidebar />

        {/* scroll content */}
        <div className="relative z-0">
          {/* Main Content */}
          <div className="relative z-0">

            {/* black gradient for binary rain */}
            <div className="fixed top-0 left-0 w-full h-[300px] bg-gradient-to-b from-black via-black to-transparent z-[9]"></div>
            {/* page content */}
            <div className="w-full bg-black relative z-10">
              {/* bg1 */}
              <div className={location.pathname === '/' ? "absolute inset-0 z-[9]" : "absolute inset-0 z-0"} style={{
                opacity: location.pathname === '/' ? 0.35 : 0.35,
                // backgroundImage: 'url(/bg1.jpeg)',
                // backgroundImage: isMobile ? 'none' : 'url(https://lyi4kyn0ep.ufs.sh/f/TvD15zmw4gYzj6nX5r4pLs59CtFRwmKOxifXkcAQbSd8PBaU)',
                backgroundImage: 'url(https://lyi4kyn0ep.ufs.sh/f/TvD15zmw4gYzj6nX5r4pLs59CtFRwmKOxifXkcAQbSd8PBaU)',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: location.pathname === '/' ? 'top center' : 'top center',
                backgroundSize: 'contain'
              }}></div>
              {/* repeating bg2 */}
              {/* <div className="absolute inset-0 z-0" style={{
                opacity: 0.2,
                // backgroundImage: 'url(/bg2.png)',
                backgroundImage: isMobile ? 'none' : 'url(https://lyi4kyn0ep.ufs.sh/f/TvD15zmw4gYz6dmtKiyuahNvHVQSYg4oRfy2ktEJXxTpW7qO)',
                backgroundRepeat: 'repeat-y',
                backgroundPosition: location.pathname === '/' ? 'center calc(300px + (100% * 0.99))' : 'center calc(100% * 0.99)',
                backgroundSize: 'contain'
              }}></div> */}


              {/* effect for homepage but here so sizes are correct */}
              {/* {location.pathname === '/' && !isMobile && (
                <div className="relative z-[8]">
                  <BinaryRain />
                </div>
              )} */}


              {/* <div className="relative grid grid-cols-6 gap-[var(--s20)] md:grid-cols-12 max-w-screen-2xl mx-auto px-[var(--s28)] sm:px-[var(--s32)] md:px-[var(--s40)] lg:px-[var(--s80)] pt-0 md:pt-0 relative z-10 min-h-[100dvh]"> */}
              <div className="relative grid grid-cols-6 gap-[var(--s20)] md:grid-cols-12 max-w-screen-2xl mx-auto px-[var(--s28)] sm:px-[var(--s32)] md:px-[var(--s40)] lg:px-[var(--s80)] pt-0 relative z-10 min-h-[100dvh]">


                {/* <div className="col-start-1 col-end-7 md:col-start-3 md:col-end-12 lg:col-start-1 lg:col-end-13"> */}
                <div className="col-start-1 col-end-7 md:col-start-4 md:col-end-12 lg:col-end-10">
                  <div className="flex flex-col gap-[var(--s40)] md:gap-[var(--s80)] pb-[var(--s80)] md:pb-[var(--s120)]">
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.5 }}
                    >
                      {/* <Suspense fallback={<Loading />}>
                    {children}
                    </Suspense> */}
                      {children}
                    </motion.div>
                  </div>
                </div>
              </div>

              {/* round */}
              <div className="absolute bottom-0 w-full rounded-b-full h-[calc(2*var(--radius-1))] bg-black translate-y-[50%]"></div>

            </div>


            <Footer />

          </div>

          <div className="fixed top-0 left-0 w-full h-full bg-light1 overflow-y-scroll z-40 opacity-0 pointer-events-none"></div>

        </div>

      </div>

    </div>
  );
};

export default MainLayout;
