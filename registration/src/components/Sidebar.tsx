import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import '../locales';

const Sidebar = () => {
        const location = useLocation();
        const { t, i18n } = useTranslation();

        // Helper to determine if a nav link is active
        const isActive = (path: string) => {
                return location.pathname === path;
        };

        const toggleLanguage = () => {
                const newLang = i18n.language === 'zh' ? 'en' : 'zh';
                i18n.changeLanguage(newLang);
        };

        return (
                <aside className="hidden h-full w-64 flex-col bg-hackathon-black/95 md:flex">
                        {/* Logo */}
                        <div className="p-4">
                                <Link to="/" className="hidden md:flex items-center justify-center">
                                        {/* <div className="border border-[#00ffc2] p-2 min-w-[5rem]">
                                                <div className="hackathon-logo text-sm text-[#00ffc2]">TEEN</div>
                                                <div className="hackathon-logo text-sm text-[#ff0099]">ai</div>
                                                <div className="hackathon-logo text-sm text-[#00ffc2]">GERS</div>
                                        </div> */}
                                        <img src="/logofull.svg" alt="Logo" className="w-64" />
                                </Link>
                        </div>

                        {/* Navigation */}
                        <nav className="flex flex-1 items-center justify-center">
                                <ul className="space-y-4">
                                        <li>
                                                <Link
                                                        to="/"
                                                        className={`flex items-center space-x-2 font-light tracking-wide transition-colors ${isActive('/') ? 'text-[#00ffc2]' : 'text-gray-400 hover:text-[#00ffc2]'}`}
                                                >
                                                        <span>{t('nav.register')}</span>
                                                </Link>
                                        </li>
                                </ul>
                        </nav>

                        {/* Language Toggle */}
                        <div className="border-t border-hackathon-lightgray/30 p-2">
                                <button
                                        onClick={toggleLanguage}
                                        className="flex w-full items-center justify-center space-x-2 font-light tracking-wide text-gray-400 hover:text-[#00ffc2]"
                                >
                                        {/* <span className="text-lg">🌐</span> */}
                                        <span>{i18n.language === 'zh' ? 'EN' : '中'}</span>
                                </button>
                        </div>

                </aside>
        );
};

export default Sidebar;
