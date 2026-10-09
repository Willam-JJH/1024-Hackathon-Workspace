import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import '../locales';

const Header = () => {
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
                <header className="fixed left-0 top-0 z-[100] w-full bg-hackathon-black md:hidden">
                        <div className="container mx-auto flex items-center justify-between p-4 border-b border-hackathon-lightgray/30">
                                {/* Logo */}

                                <Link to="/" className="flex items-center min-w-[5rem]">
                                        <div className="overflow-hidden w-16 h-16 relative translate-y-2">
                                                <img
                                                        src="/TeenAIgers.svg"
                                                        alt="TeenAIgers Logo"
                                                        className="absolute bottom-0 left-0 w-20 h-20 transform -translate-x-1 -translate-y-6"
                                                        style={{ objectPosition: 'bottom left', objectFit: 'cover' }}
                                                />
                                        </div>
                                </Link>



                                {/* Mobile Menu Button */}
                                <div className="md:hidden">
                                        <button
                                                onClick={() => document.getElementById('mobileMenu')?.classList.toggle('hidden')}
                                                className="p-2 text-primary"
                                        >
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                                </svg>
                                        </button>
                                </div>
                        </div>

                        {/* Mobile Menu Dropdown */}
                        <div id="mobileMenu" className="hidden w-full bg-hackathon-black md:hidden">
                                <div className="flex justify-end border-b border-hackathon-lightgray/30">
                                        <ul className="space-y-4 p-4">
                                                <li>
                                                        <Link
                                                                to="/"
                                                                className={`flex items-center justify-end space-x-2 font-light tracking-wide transition-colors ${isActive('/') ? 'text-primary' : 'text-gray-400 hover:text-[#00ffc2]'}`}
                                                        >
                                                                <span>{t('nav.home')}</span>
                                                        </Link>
                                                </li>
                                                <li>
                                                        <Link
                                                                to="/about"
                                                                className={`flex items-center justify-end space-x-2 font-light tracking-wide transition-colors ${isActive('/about') ? 'text-primary' : 'text-gray-400 hover:text-[#00ffc2]'}`}
                                                        >
                                                                <span>{t('nav.about')}</span>
                                                        </Link>
                                                </li>
                                                <li>
                                                        <Link
                                                                to="/timeline"
                                                                className={`flex items-center justify-end space-x-2 font-light tracking-wide transition-colors ${isActive('/timeline') ? 'text-primary' : 'text-gray-400 hover:text-[#00ffc2]'}`}
                                                        >
                                                                <span>{t('nav.timeline')}</span>
                                                        </Link>
                                                </li>
                                                <li>
                                                        <Link
                                                                to="/faq"
                                                                className={`flex items-center justify-end space-x-2 font-light tracking-wide transition-colors ${isActive('/faq') ? 'text-primary' : 'text-gray-400 hover:text-[#00ffc2]'}`}
                                                        >
                                                                <span>{t('nav.faq')}</span>
                                                        </Link>
                                                </li>
                                                <li>
                                                        <Link
                                                                to="/register"
                                                                className={`flex items-center justify-end space-x-2 font-light tracking-wide transition-colors ${isActive('/register') ? 'text-primary' : 'text-gray-400 hover:text-[#00ffc2]'}`}
                                                        >
                                                                <span>{t('nav.register')}</span>
                                                        </Link>
                                                </li>
                                                <li>
                                                        <button
                                                                onClick={toggleLanguage}
                                                                className="flex w-full items-center justify-end space-x-2 font-light tracking-wide text-gray-400 hover:text-primary"
                                                        >
                                                                <span>{i18n.language === 'zh' ? 'EN' : '中'}</span>
                                                        </button>
                                                </li>
                                        </ul>
                                </div>
                        </div>
                </header>
        );
};

export default Header;
