import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const Footer = () => {
        const { t } = useTranslation();

        return (
                <footer className="bg-[#222]] text-white px-[var(--s24)] md:px-[var(--s60)] lg:px-[var(--s80)] pt-[var(--s96)] pb-[var(--s80)] relative sticky bottom-0 w-full z-0">
                        <div className="absolute z-0 w-full top-0 h-full left-0">
                                {/* <video src="https://storage.googleapis.com/sesame-dev-public/video/UpdateFade_smaller.mp4" autoPlay playsInline muted loop className="w-full h-full object-cover"></video> */}
                                {/* <video src="/nighttimemilkywaytimelapse1.mp4" autoPlay playsInline muted loop className="w-full h-full object-cover"></video> */}

                                {/* <video src="https://lyi4kyn0ep.ufs.sh/f/TvD15zmw4gYzNADe9pxEYwDuTVvd24yKLOZaq3N87e06RCci" autoPlay playsInline muted loop className="w-full h-full object-cover"></video> */}

                                {/* <img src="/meadow.jpeg" alt='Background' className="w-full h-full object-cover" /> */}
                                <div className="w-full h-full object-cover bg-[#222]"></div>

                                <div className="absolute bg-black/20 inset-0"></div>
                        </div>

                        <div className="flex flex-col items-start relative z-10 max-w-screen-2xl mx-auto">
                                {/* <div className="pt-8 pb-6">
                                <img src="/logo.svg" alt="TeenAIgers Logo" className="h-20 md:h-24" />
                        </div>

                        <div className="block md:hidden bg-white/20 h-[1px] w-full"></div>

                        <div className="flex flex-col md:flex-row justify-between w-full items-center md:items-start gap-8">
                                <div className="flex flex-col md:flex-row text-white py-4 gap-6 opacity-80">
                                        <Link to="/" className="hover:text-primary">Home</Link>
                                        <Link to="/about" className="hover:text-primary">About</Link>
                                        <Link to="/faq" className="hover:text-primary">FAQ</Link>
                                        <Link to="mailto:" className="hover:text-primary">Contact us</Link>
                                </div>

                                <div className="flex flex-col items-center md:items-end">
                                        <div className="text-sm font-light text-white mb-2">{t('footer.sponsors')}</div>
                                        <img src="/partners-logos.svg" alt="Partner Logos" className="max-w-[200px] md:max-w-[180px]" />
                                </div>
                        </div>

                        <div className="bg-white/20 h-[1px] w-full mt-8"></div>

                        <div className="py-6 opacity-50 md:opacity-90 flex flex-col-reverse sm:flex-row justify-between w-full gap-4">
                                <p className="text-xs text-primary">
                                        © 2025 TeenAIgers | {t('footer.tagline')}
                                </p>
                        </div> */}
                                <div className="pb-[var(--s40)] md:pb-[var(--s10)]">
                                        TeenAIgers
                                </div>
                                <div className="block md:hidden bg-white/20 h-[1px] w-full"></div>
                                <div className="flex justify-between w-full items-center">
                                        <div className="flex flex-col md:flex-row text-sidebar-light py-[var(--s40)] md:py-[var(--s24)] gap-[var(--s24)] opacity-80">
                                                <Link to="/">Home</Link>
                                                <Link to="/about">About Us</Link>
                                                <a href="mailto:carriemcrena@gmail.com">Contact us</a>
                                        </div>
                                        <div className="hidden md:flex gap-[var(--s32)]">
                                                {/* <a target="_blank" rel="noopener noreferrer" href="https://x.com/sesame">
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 51 50" className="block w-[var(--s28)] h-[var(--s28)]">
                                                        <path fill="#fff" fillRule="evenodd" d="M11.423 7.5a3 3 0 0 0-3 3v29a3 3 0 0 0 3 3h29a3 3 0 0 0 3-3v-29a3 3 0 0 0-3-3zm24.615 7h-3.51l-5.774 6.72-5.034-6.72h-7.297l8.683 11.48-8.221 9.52h3.51l6.374-7.327L30.31 35.5h7.112l-9.052-12.087zM33.22 33.353h-1.94L18.535 16.507h2.124z" clipRule="evenodd" />
                                                </svg>
                                        </a>

                                        <a target="_blank" rel="noopener noreferrer" href="https://www.linkedin.com/company/sesameai/">
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 51 50" className="block w-[var(--s28)] h-[var(--s28)]">
                                                        <path fill="#fff" d="M37.398 37.823h-5.186V29.7c0-1.936-.034-4.43-2.697-4.43-2.7 0-3.114 2.11-3.114 4.29v8.261h-5.186V21.121h4.979v2.282h.07a5.46 5.46 0 0 1 4.911-2.697c5.256 0 6.226 3.457 6.226 7.955zM15.364 18.838a3.01 3.01 0 1 1-.001-6.018 3.01 3.01 0 0 1 0 6.018m2.593 18.985h-5.192V21.12h5.192zm22.027-29.82H10.159a2.554 2.554 0 0 0-2.582 2.523v29.949A2.556 2.556 0 0 0 10.159 43h29.825a2.56 2.56 0 0 0 2.593-2.525V10.523a2.56 2.56 0 0 0-2.593-2.522" />
                                                </svg>
                                        </a> */}
                                                <div className="text-sm font-light text-white mb-2 -translate-y-[70px] -translate-x-[10px]">{t('footer.sponsors')}</div>
                                                <img src="/partners-logos.png" alt="Partner Logos" className="w-[50px] md:w-[50px] scale-[350%] -translate-x-10 translate-y-10" />
                                        </div>
                                </div>
                                <div className="bg-white/20 h-[1px] w-full"></div>
                                <div className="flex md:hidden gap-[var(--s32)] mt-[var(--s46)]">
                                        {/* <a target="_blank" rel="noopener noreferrer" href="https://x.com/sesame">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 51 50" className="block w-[var(--s40)] h-[var(--s40)]">
                                                <path fill="#fff" fillRule="evenodd" d="M11.423 7.5a3 3 0 0 0-3 3v29a3 3 0 0 0 3 3h29a3 3 0 0 0 3-3v-29a3 3 0 0 0-3-3zm24.615 7h-3.51l-5.774 6.72-5.034-6.72h-7.297l8.683 11.48-8.221 9.52h3.51l6.374-7.327L30.31 35.5h7.112l-9.052-12.087zM33.22 33.353h-1.94L18.535 16.507h2.124z" clipRule="evenodd" />
                                        </svg>
                                </a>
                                <a target="_blank" rel="noopener noreferrer" href="https://www.linkedin.com/company/sesameai/">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 51 50" className="block w-[var(--s40)] h-[var(--s40)]">
                                                <path fill="#fff" d="M37.398 37.823h-5.186V29.7c0-1.936-.034-4.43-2.697-4.43-2.7 0-3.114 2.11-3.114 4.29v8.261h-5.186V21.121h4.979v2.282h.07a5.46 5.46 0 0 1 4.911-2.697c5.256 0 6.226 3.457 6.226 7.955zM15.364 18.838a3.01 3.01 0 1 1-.001-6.018 3.01 3.01 0 0 1 0 6.018m2.593 18.985h-5.192V21.12h5.192zm22.027-29.82H10.159a2.554 2.554 0 0 0-2.582 2.523v29.949A2.556 2.556 0 0 0 10.159 43h29.825a2.56 2.56 0 0 0 2.593-2.525V10.523a2.56 2.56 0 0 0-2.593-2.522" />
                                        </svg>
                                </a> */}
                                        <div className="text-sm font-light text-white mb-2 -translate-y-[70px] -translate-x-[10px]">{t('footer.sponsors')}</div>
                                        <img src="/partners-logos.svg" alt="Partner Logos" className="w-[50px] md:w-[50px] scale-[350%] -translate-x-10" />
                                </div>
                                <div className="mt-[var(--s40)] md:mt-[var(--s32)] opacity-50 md:opacity-90 flex flex-col-reverse sm:flex-row justify-between w-full gap-[var(--s24)]">
                                        <p className="text-caption">Copyright © {2025} Sparkr - TeenAIgers</p>
                                        <div className="text-caption flex gap-[var(--s24)]">
                                                {/* <Link to="/privacy">Privacy</Link>
                                        <Link to="/terms">Terms</Link> */}
                                        </div>
                                </div>
                        </div>
                </footer>
        );
};

export default Footer;
