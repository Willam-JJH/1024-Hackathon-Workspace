import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

const FAQPage = () => {
  const [openId, setOpenId] = useState<string | null>(null);
  const { t } = useTranslation();

  const faqItems: FAQItem[] = useMemo(() => {
    const faqObj = t('faq', { returnObjects: true }) as Record<string, any>;
    // Filter keys that are numbers and sort them
    return Object.keys(faqObj)
      .filter(key => !isNaN(Number(key)))
      .sort((a, b) => Number(a) - Number(b))
      .map(key => ({
        id: key,
        question: t(`faq.${key}.q`),
        answer: t(`faq.${key}.a`)
      }));
  }, [t]);

  const toggleFAQ = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <div className="container mx-auto pt-[var(--s120)] md:pt-[var(--s200)]">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mx-auto max-w-3xl"
      >
        <h1 className="mb-8 text-center text-3xl font-light tracking-wider md:text-4xl">
          {t('faq.title')}
        </h1>

        <p className="mb-12 text-center text-lg font-light text-gray-300">
          {t('faq.subtitle')}
        </p>

        <div className="mb-12 space-y-4">
          {faqItems.map((faq, index) => (
            <motion.div
              key={faq.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="overflow-hidden rounded-sm bg-hackathon-gray/20"
            >
              <button
                className="flex w-full items-center justify-between p-4 text-left font-light transition hover:bg-hackathon-gray/30"
                onClick={() => toggleFAQ(faq.id)}
              >
                <span>{faq.question}</span>
                <span className="ml-2 flex h-6 w-6 items-center justify-center rounded-full bg-hackathon-gray/50">
                  {openId === faq.id ? '-' : '+'}
                </span>
              </button>

              <AnimatePresence>
                {openId === faq.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="border-t border-hackathon-gray/30 px-4 py-3 text-gray-300"
                  >
                    <p>{faq.answer}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.5 }}
          className="mt-12 text-center"
        >
          <p className="mb-6 text-lg font-light text-gray-300">
            {t('faq.contact.title')}
          </p>
          <p className="text-gray-400">
            {t('faq.contact.email')}
          </p>
          <p className="mb-8 text-gray-400">
            {t('faq.contact.wechat')}
          </p>

          <Link
            to="/register"
            className="inline-block rounded-sm bg-hackathon-gray px-8 py-3 font-light transition hover:bg-opacity-80"
          >
            {t('nav.register')}
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default FAQPage;
