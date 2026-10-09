import { motion, useScroll, useTransform } from 'framer-motion';
import { useTranslation } from 'react-i18next';

const AboutPage = () => {
  const { t } = useTranslation();

  // Import SVGs
  const pointer1 = "/icons/pointer1.svg";
  const pointer2 = "/icons/pointer2.svg";
  const pointer3 = "/icons/pointer3.svg";

  return (
    <div className="container mx-auto px-4 py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mx-auto max-w-3xl"
      >
        {/* Main Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-20 text-center"
        >
          <h1 className="mb-4 space-x-2 text-4xl font-bold md:text-6xl">
            <span>{t('about.mainDescription.prefix')}</span>
            <span className="text-[#00ffc2]">{t('about.mainDescription.teen')}</span>
            <span className="text-[#ff0099]">{t('about.mainDescription.ai')}</span>
            <span className="text-[#00ffc2]">{t('about.mainDescription.gers')}</span>
          </h1>
          <p className="mx-auto max-w-4xl px-4 text-lg font-light tracking-wider text-gray-300 md:text-2xl">
            {t('about.mainDescription.middle')}{' '}
            <span className="font-semibold text-white">{t('about.mainDescription.emphasis')}</span>{' '}
            {t('about.mainDescription.conjunction')}{' '}
            <span className="font-semibold text-white">{t('about.mainDescription.suffix')}</span>
          </p>
        </motion.div>

        {/* Intro Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="mb-20 text-center text-xl md:text-2xl"
        >
          <p>
            {t('about.intro.text1')}{' '}
            <span className="text-[#ff0099]">{t('about.intro.accent1')}</span>
            {t('about.intro.text2')}
          </p>
        </motion.div>

        {/* Section 1 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="mb-20 text-center text-xl md:text-2xl"
        >
          <p>{t('about.section1.text')}</p>
        </motion.div>

        {/* Theme Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="mb-20 text-center"
        >
          <h2 className="mb-2 text-3xl font-bold md:text-4xl">{t('about.theme.line1')}</h2>
          <h2 className="mb-4 text-3xl font-bold md:text-4xl">{t('about.theme.line2')}</h2>
          <p className="text-xl text-gray-300">{t('about.theme.subtitle')}</p>
        </motion.div>

        {/* Section 2 with Pointer */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-20 flex w-full items-start"
        >
          <motion.div
            initial={{ x: -100, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            viewport={{ once: true }}
            className="w-5/6 text-left text-lg md:text-xl"
          >
            <p>
              {t('about.section2.text1')}{' '}
              {t('about.section2.text2')}{' '}
              {t('about.section2.text3')}
            </p>
            <p className="mt-4">
              {t('about.section2.text4')}{' '}
              <span className="font-semibold text-[#00ffc2]">{t('about.section2.accent')}</span>
            </p>
          </motion.div>
          <motion.div
            initial={{ y: -50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="w-1/6"
          >
            {/* <img src={pointer1} alt="pointer" className="scale-[2.25] translate-x-1 -translate-y-15" /> */}
          </motion.div>
        </motion.div>

        {/* Section 3 with Left Pointer */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-20 flex w-full flex-row-reverse items-start"
        >
          <motion.div
            initial={{ x: 100, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            viewport={{ once: true }}
            className="w-5/6 text-right text-lg md:text-xl"
          >
            <p className="mb-4">{t('about.section3.text1')}</p>
            <p>
              {t('about.section3.text2')}{' '}
              <span className="font-bold text-[#00ffc2]">{t('about.section3.accent1')}</span>
              {t('about.section3.text3')}{' '}
              <span className="font-bold text-[#ff0099]">{t('about.section3.accent2')}</span>
              {t('about.section3.text4')}
            </p>
          </motion.div>
          <motion.div
            initial={{ y: -50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="w-1/6"
          >
            {/* <img src={pointer2} alt="pointer" className="scale-[2.75] -translate-x-59 -translate-y-17" /> */}
          </motion.div>
        </motion.div>

        {/* Section 4 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.8 }}
          className="mb-20 text-center text-lg md:text-xl"
        >
          <p>
            {t('about.section4.text1')}{' '}
            <span className="font-semibold text-[#ff0099]">{t('about.section4.accent')}</span>
            {t('about.section4.text2')}
          </p>
          <p className="mt-4">
            {t('about.section4.text3')}{' '}
            <span className="font-semibold text-[#00ffc2]">{t('about.section4.accent2')}</span>
          </p>
        </motion.div>

        {/* Section 5 with Right Pointer */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-20 flex w-full items-start"
        >
          <motion.div
            initial={{ x: -100, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            viewport={{ once: true }}
            className="w-3/4 text-left text-lg md:text-xl"
          >
            <p>
              {t('about.section5.text1')}{' '}
              <span className="font-semibold text-[#00ffc2]">{t('about.section5.accent')}</span>
            </p>
          </motion.div>
          <motion.div
            initial={{ y: -50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="w-1/4"
          >
            {/* <img src={pointer3} alt="pointer" className="scale-[2.75] translate-x-7 translate-y-25" /> */}
          </motion.div>
        </motion.div>

        {/* Final Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.8 }}
          className="text-center"
        >
          <p className="mb-6 text-xl font-bold tracking-wider md:text-2xl">
            {t('about.section6.text1')}
          </p>
          <p className="text-2xl font-mono text-[#00ffc2] md:text-3xl">
            {t('about.section6.accent')}
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default AboutPage;
