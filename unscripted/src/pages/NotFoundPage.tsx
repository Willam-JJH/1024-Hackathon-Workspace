import { Link } from "react-router-dom";
import { useT } from "../i18n/core";

const NotFoundPage = () => {
  const t = useT();

  return (
    <div className="mx-auto flex max-w-screen-2xl flex-col items-start px-5 py-[var(--s120)] sm:px-8 lg:px-12">
      <div className="font-label text-xs tracking-[0.3em] text-acid">{t.notFound.code}</div>
      <h1 className="mt-4 font-display text-3xl text-white sm:text-5xl">{t.notFound.title}</h1>
      <p className="mt-4 text-white/65">{t.notFound.body}</p>
      <Link to="/" className="btn-primary mt-10">
        {t.common.backHome}
      </Link>
    </div>
  );
};

export default NotFoundPage;
