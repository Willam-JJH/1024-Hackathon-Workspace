import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/** 切换板块时回到顶部 */
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [pathname]);

  return null;
};

export default ScrollToTop;
