import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { ScrollTrigger } from '../lib/gsapConfig';

const useScrollReset = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Reset standard window scroll
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });

    // Refresh GSAP ScrollTrigger instances for new page height
    setTimeout(() => {
      ScrollTrigger.refresh();
    }, 100);
  }, [pathname]);
};

export default useScrollReset;
