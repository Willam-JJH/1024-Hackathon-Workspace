import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import TeacherForm from './RegisterTeacher';
import RegisterStudent from './RegisterStudent';

const RegisterPage = () => {
  const { t } = useTranslation();
  const [role, setRole] = useState<'student' | 'teacher'>('student');
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  return (
    <div className="container mx-auto pt-[var(--s120)] md:pt-[var(--s200)]">
      <div className="mx-auto w-full">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8 text-center"
        >
          <h1 className="mb-3 text-3xl font-light tracking-wider">{t('register.title')}</h1>
          <p className="mx-auto max-w-lg text-lg font-light text-muted-foreground">
            {t('register.subtitle')}
          </p>

        </motion.div>

        {/* Role Toggle */}

        <div className="mb-8">
          <div className="relative mx-auto h-12 w-full max-w-md overflow-hidden">
            <h3 className="text-left">{t('register.roleSelection.title')}</h3>
          </div>
          <div className="relative mx-auto h-12 w-full max-w-md overflow-hidden rounded-lg bg-primary/20">


            <motion.div
              className="absolute h-full w-1/2 rounded-lg bg-primary"
              animate={{ x: role === 'teacher' ? '100%' : '0%' }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            />

            <div className="relative flex h-full">
              <button
                className={`flex-1 font-light transition ${role === 'student' ? 'text-primary-foreground' : 'text-muted-foreground'}`}
                onClick={() => setRole('student')}
              >
                {t('register.roleSelection.student')}
              </button>
              <button
                className={`flex-1 font-light transition ${role === 'teacher' ? 'text-primary-foreground' : 'text-muted-foreground'}`}
                onClick={() => setRole('teacher')}
              >
                {t('register.roleSelection.teacher')}
              </button>
            </div>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {role === 'student' ? (
            <motion.div
              initial={{ opacity: 0, x: -100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 100 }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 30
              }}
            >
              <RegisterStudent onSuccess={() => setShowSuccessModal(true)} />
            </motion.div>
          ) : (
            <motion.div
              key="teacher"
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 30
              }}
            >
              <TeacherForm onSuccess={() => setShowSuccessModal(true)} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Success Modal */}
      <AnimatePresence>
        {showSuccessModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4"
            onClick={() => setShowSuccessModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-md rounded bg-primary/20 p-6 text-center"
              onClick={e => e.stopPropagation()}
            >
              <button
                className="absolute right-4 top-4 text-muted-foreground hover:text-primary-foreground"
                onClick={() => setShowSuccessModal(false)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              <div className="mb-4 flex items-center justify-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>

              <h3 className="mb-2 text-xl font-light">{t('register.submit.success.title')}</h3>
              <p className="mb-6 text-muted-foreground">
                {t('register.submit.success.message')}
              </p>

              <button
                className="w-full bg-primary p-3 text-center font-light transition hover:bg-opacity-80"
                onClick={() => setShowSuccessModal(false)}
              >
                {t('register.submit.success.close')}
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div >
  );
};

export default RegisterPage;
