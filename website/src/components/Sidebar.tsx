import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import '../locales';

const Sidebar = () => {
        const location = useLocation();
        const { t, i18n } = useTranslation();

        // nav link is active
        const isActive = (path: string) => {
                return location.pathname === path;
        };

        const toggleLanguage = () => {
                const newLang = i18n.language === 'zh' ? 'en' : 'zh';
                i18n.changeLanguage(newLang);
        };

        return (
                <header className="fixed z-50 top-[var(--s200)] right-0 left-0 w-full mbg-[transparent] pointer-events-none">
                        <div className='grid gap-[var(--s20)] grid-cols-12 px-[var(--s28)] sm:px-[var(--s32)] md:px-[var(--s40)] lg:px-[var(--s28)] max-w-screen-2xl mx-auto'>

                                <div className="col-start-1 col-end-7 md:col-end-3 lg:col-end-4 xl:col-start-2 flex flex-row justify-between items-center md:items-start md:flex-col gap-[var(--s20)] pointer-events-auto py-[var(--s18)] md:py-0">
                                        {/* Logo */}
                                        <Link to="/" className="hidden md:flex">
                                                <div className="overflow-hidden w-16 h-16 relative -translate-x-3 translate-y-2">
                                                        <img
                                                                src="/TeenAIgers.svg"
                                                                alt="TeenAIgers Logo"
                                                                className="absolute bottom-0 left-0 w-20 h-20 transform -translate-x-1 -translate-y-6"
                                                                style={{ objectPosition: 'bottom left', objectFit: 'cover' }}
                                                        />
                                                </div>
                                        </Link>


                                        <div className="hidden md:flex flex-col gap-[var(--s16)]">
                                                <ul className="flex flex-col gap-[var(--s6)]">
                                                        <li>
                                                                <Link
                                                                        to="/"
                                                                        className={`block transition-opacity duration-300 ${isActive('/') ? 'text-sidebar' : 'opacity-50 hover:opacity-100 text-sidebar-light hover:font-[630]'}`}
                                                                >
                                                                        {t('nav.home')}
                                                                </Link>
                                                        </li>
                                                        <li>
                                                                <Link
                                                                        to="/about"
                                                                        className={`block transition-opacity duration-300 ${isActive('/about') ? 'text-sidebar' : 'opacity-50 hover:opacity-100 text-sidebar-light hover:font-[630]'}`}
                                                                >
                                                                        {t('nav.about')}
                                                                </Link>
                                                        </li>
                                                        <li>
                                                                <Link
                                                                        to="/timeline"
                                                                        className={`block transition-opacity duration-300 ${isActive('/timeline') ? 'text-sidebar' : 'opacity-50 hover:opacity-100 text-sidebar-light hover:font-[630]'}`}
                                                                >
                                                                        {t('nav.timeline')}
                                                                </Link>
                                                        </li>
                                                        <li>
                                                                <Link
                                                                        to="/faq"
                                                                        className={`block transition-opacity duration-300 ${isActive('/faq') ? 'text-sidebar' : 'opacity-50 hover:opacity-100 text-sidebar-light hover:font-[630]'}`}
                                                                >
                                                                        {t('nav.faq')}
                                                                </Link>
                                                        </li>
                                                </ul>

                                                <div className="flex flex-col gap-[var(--s16)]">

                                                        <div className="bg-white/20 h-[1px] w-full"></div>

                                                        <ul className="flex flex-col gap-[var(--s6)]">
                                                                <li>
                                                                        <Link
                                                                                to="/register"
                                                                                className="block transition-opacity duration-300 opacity-50 hover:opacity-100 text-sidebar-light hover:font-[630]"
                                                                                data-anchor-link="true"
                                                                        >
                                                                                {t('nav.register')}
                                                                        </Link>
                                                                </li>
                                                                <li>
                                                                        <button
                                                                                onClick={toggleLanguage}
                                                                                className="block transition-opacity duration-300 opacity-50 hover:opacity-100 text-sidebar-light hover:font-[630]"
                                                                        >
                                                                                {i18n.language === 'zh' ? 'EN' : '中'}
                                                                        </button>
                                                                </li>
                                                        </ul>
                                                </div>
                                        </div>

                                </div>
                        </div>
                </header>
        );
};

export default Sidebar;
