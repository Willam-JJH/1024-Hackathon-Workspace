import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import Loading from './components/Loading';
import { useImagePreloader } from './lib/hooks/useImagePreloader';

const RegisterPage = lazy(() => import('./pages/RegisterPage'));

function App() {
  const imagesLoaded = useImagePreloader(['/blackhole-bg.png']);

  if (!imagesLoaded) {
    return <Loading />;
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={
          <Suspense fallback={<Loading />}>
            <MainLayout>
              <RegisterPage />
            </MainLayout>
          </Suspense>
        } />
      </Routes>
    </Router>
  );
}

export default App;
