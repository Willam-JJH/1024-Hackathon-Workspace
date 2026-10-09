import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop = () => {
        const { pathname } = useLocation();

        useEffect(() => {
                // Use requestAnimationFrame to ensure DOM is ready
                const scrollToTop = () => {
                        const scrollContainer = document.querySelector('.overflow-y-scroll');
                        if (scrollContainer) {
                                scrollContainer.scrollTop = 0;
                        }
                        window.scrollTo(0, 0);
                };

                // Queue the scroll operation
                requestAnimationFrame(scrollToTop);
        }, [pathname]);

        return null;
};

export default ScrollToTop;
