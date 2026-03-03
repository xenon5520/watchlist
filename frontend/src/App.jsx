import React, { useEffect, useState } from 'react'
import { Route, Routes, useLocation } from 'react-router'
import { ChevronUp } from 'lucide-react';
import HomePage from './pages/HomePage'
import CreatePage from './pages/CreatePage'
import MovieDetailPage from './pages/MovieDetailPage'

const ScrollToTop = () => {
  const { pathname } = useLocation();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  const toggleVisibility = () => {
    if (window.scrollY > 300) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  useEffect(() => {
    window.addEventListener('scroll', toggleVisibility);
    return () => {
      window.removeEventListener('scroll', toggleVisibility);
    };
  }, []);

  return (
    <button
      onClick={scrollToTop}
      className={`fixed bottom-8 right-8 z-50 btn btn-circle btn-primary shadow-2xl transition-all duration-300 transform scale-110 active:scale-95 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'
        }`}
      aria-label="Scroll to top"
    >
      <ChevronUp size={24} strokeWidth={3} />
    </button>
  );
};

const App = () => {
  return (
    <div className="min-h-screen bg-brand-bg flex flex-col">
      <main className="flex-grow">
        <Routes>
          <Route path='/' element={<HomePage />} />
          <Route path='/create' element={<CreatePage />} />
          <Route path='/movie/:id' element={<MovieDetailPage />} />
        </Routes>
      </main>
      <ScrollToTop />
    </div>
  )
}

export default App
