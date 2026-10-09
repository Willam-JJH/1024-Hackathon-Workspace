import { useTranslation } from 'react-i18next';

const Footer = () => {
        const { t } = useTranslation();

        return (
                <footer className="mt-auto bg-[#111] py-8">
                        <div className="container mx-auto px-8 text-center">
                                {/* <div className="mb-6">
                                        <div className="mb-2 text-sm font-light">{t('footer.sponsors')}</div>
                                        <div className="flex justify-center">
                                                <img src="/partner-logos.jpeg" alt="Partner Logos" className="max-w-xs" />
                                        </div>
                                </div> */}

                                <div className="mt-6 text-xs font-light text-[#00ffc2]">
                                        © 2025 Sparkr - TeenAIgers | {t('footer.tagline')}
                                </div>
                        </div>
                </footer>
        );
};

export default Footer;
