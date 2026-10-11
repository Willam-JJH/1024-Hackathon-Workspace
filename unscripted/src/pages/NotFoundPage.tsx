import { Link } from "react-router-dom";

const NotFoundPage = () => (
  <div className="mx-auto flex max-w-screen-2xl flex-col items-start px-5 py-[var(--s120)] sm:px-8 lg:px-12">
    <div className="font-pixel text-xs tracking-[0.3em] text-acid">ERROR 404</div>
    <h1 className="mt-4 font-display text-3xl text-white sm:text-5xl">这个页面没有剧本</h1>
    <p className="mt-4 text-white/50">你访问的地址不存在，或者还没开工。</p>
    <Link to="/" className="btn-primary mt-10">
      回到主页
    </Link>
  </div>
);

export default NotFoundPage;
