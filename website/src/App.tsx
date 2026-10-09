import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout.tsx';
import Loading from './components/Loading.tsx';


import { useImagePreloader } from './lib/hooks/useImagePreloader.tsx';


const HomePage = lazy(() => import('./pages/HomePage.tsx'));
const AboutPage = lazy(() => import('./pages/AboutPage.tsx'));
const FAQPage = lazy(() => import('./pages/FAQPage.tsx'));
const RegisterPage = lazy(() => import('./pages/RegisterPage.tsx'));
const TimelinePage = lazy(() => import('./pages/TimelinePage.tsx'));

function App() {
  const imagesLoaded = useImagePreloader(['partners-logos.png', 'logofull.svg', 'teenaigersfavicon.png', 'TeenAIgers.svg']);

  if (!imagesLoaded) {
    return <Loading />;
  }

  return (
    <Router>
      <Suspense fallback={<Loading />}>
        <Routes>
          <Route path="/" element={
            <MainLayout>
              <HomePage />
            </MainLayout>
          } />
          <Route path="/about" element={
            <MainLayout>
              <AboutPage />
            </MainLayout>
          } />
          <Route path="/faq" element={
            <MainLayout>
              <FAQPage />
            </MainLayout>
          } />
          <Route path="/timeline" element={
            <MainLayout>
              <TimelinePage />
            </MainLayout>
          } />
          <Route path="/register" element={
            <MainLayout>
              <RegisterPage />
            </MainLayout>
          } />
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;
