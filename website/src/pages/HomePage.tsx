import React from 'react';
import BinaryRain from '../components/BinaryRain';
import TimelineEvent, { TimelineEventData } from '../components/TimelineEvent';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';



const HomePage = () => {
  const { t } = useTranslation();
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6
      }
    }
  };

  const timelineEvents: TimelineEventData[] = [
    {
      day: t('about.timeline.offline1.title'),
      events: t('about.timeline.offline1.events', { returnObjects: true }) as string[],
      isLeft: true,
      variant: 'primary'
    },
    {
      day: t('about.timeline.offline2.title'),
      events: t('about.timeline.offline2.events', { returnObjects: true }) as string[],
      isLeft: false,
      variant: 'primary'
    },
    {
      day: t('about.timeline.offline3.title'),
      events: t('about.timeline.offline3.events', { returnObjects: true }) as string[],
      isLeft: true,
      variant: 'primary'
    },
    {
      day: t('about.timeline.online.title'),
      events: t('about.timeline.online.events', { returnObjects: true }) as string[],
      isLeft: false,
      centered: true,
      variant: 'secondary'
    },
    {
      day: t('about.timeline.offline4.title'),
      events: t('about.timeline.offline4.events', { returnObjects: true }) as string[],
      isLeft: false,
      variant: 'primary'
    },
    {
      day: t('about.timeline.offline5.title'),
      events: t('about.timeline.offline5.events', { returnObjects: true }) as string[],
      isLeft: true,
      variant: 'primary'
    }
  ];
  return (
    <div className="relative w-full pt-[var(--s120)] md:pt-[var(--s146)]">

      {/* Hero Section */}
      <section className="relative z-10 mb-24 px-4">
        <motion.div
          className="mx-auto max-w-4xl text-center"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.h1
            className="mb-6 text-4xl font-light tracking-wider md:text-6xl"
            variants={itemVariants}
          >
            <div className="text-area">
              {/* <span className="smoltitle wider text-[1.5rem]">2025</span> */}
              <div className="title-group glitch narrower flex justify-center">
                <img
                  className="title w-full max-w-[400px] mx-auto h-auto object-contain"
                  src="/logofull.svg"
                  alt="Logo"
                />
              </div>
            </div>
          </motion.h1>

          <motion.p
            className="mb-10 text-2xl font-light text-muted-foreground"
            variants={itemVariants}
          >
            {t('hero.subtitle')}
          </motion.p>

          <motion.p
            className="mb-12 text-lg font-light leading-relaxed text-muted-foreground"
            variants={itemVariants}
          >
            {t('hero.description')}
          </motion.p>

          <motion.div
            className="flex flex-col items-center justify-center space-y-4 sm:flex-row sm:space-x-6 sm:space-y-0"
            variants={itemVariants}
          >
            <Link
              to="/register"
              className="w-full rounded-sm bg-muted px-8 py-3 text-center font-light transition duration-300 ease-in-out hover:bg-primary hover:bg-opacity-80 hover:scale-105 hover:shadow-lg hover:shadow-primary/20 sm:w-auto"
            >
              {t('hero.register')}
            </Link>
            <Link
              to="/about"
              className="w-full rounded-sm border border-muted px-8 py-3 text-center font-light transition duration-300 ease-in-out hover:bg-primary/20 hover:border-primary hover:scale-105 hover:shadow-lg hover:shadow-primary/20 sm:w-auto"
            >
              {t('hero.learnMore')}
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="mb-24 px-4">
        <div className="mx-auto max-w-4xl">
          <motion.h2
            className="mb-12 text-center text-3xl font-light tracking-wide"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            {t('features.title')}
          </motion.h2>

          <div className="grid gap-8 md:grid-cols-3">
            <motion.div
              className="rounded-sm bg-primary/20 p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2 }}
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-2xl">
                🚀
              </div>
              <h3 className="mb-3 text-xl font-light">{t('features.innovation.title')}</h3>
              <p className="text-muted-foreground">
                {t('features.innovation.description')}
              </p>
            </motion.div>

            <motion.div
              className="rounded-sm bg-primary/20 p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.4 }}
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-2xl">
                👥
              </div>
              <h3 className="mb-3 text-xl font-light">{t('features.teamwork.title')}</h3>
              <p className="text-muted-foreground">
                {t('features.teamwork.description')}
              </p>
            </motion.div>

            <motion.div
              className="rounded-sm bg-primary/20 p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.6 }}
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-2xl">
                🏆
              </div>
              <h3 className="mb-3 text-xl font-light">{t('features.rewards.title')}</h3>
              <p className="text-muted-foreground">
                {t('features.rewards.description')}
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Prizes Section */}
      <section className="mb-24 px-4">
        <div className="mx-auto max-w-4xl">
          <motion.h2
            className="mb-12 text-center text-3xl font-light tracking-wide"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2.8 }}
          >
            {t('prizes.title')}
          </motion.h2>

          <motion.div
            className="flex flex-col items-center justify-center md:flex-row md:space-x-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 3 }}
          >
            <div className="mb-8 md:mb-0">

              {/* <img className='h-24 w-24' src='/icons/money.svg'></img> */}
              <img className='h-24 w-24' src='https://lyi4kyn0ep.ufs.sh/f/TvD15zmw4gYzLozwf02dKlFfs1jAh4mR5YT0b3gMwevOxqpZ'></img>
              {/* <svg className="h-24 w-24 text-green-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                <circle cx="12" cy="12" r="10" />
                <path d="M16 8h-6a2 2 0 100 4h4a2 2 0 110 4h-6" />
                <line x1="12" y1="6" x2="12" y2="18" />
              </svg> */}
            </div>
            <div className="text-center md:text-left">
              <h3 className="mb-2 text-4xl font-bold text-primary">{t('prizes.amount')}</h3>
              <p className="text-xl text-muted-foreground">{t('prizes.description')}</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Venue Section */}
      <section className="mb-24 px-4">
        <div className="mx-auto max-w-4xl">
          <motion.h2
            className="mb-12 text-center text-3xl font-light tracking-wide"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2.6 }}
          >
            {t('venue.title')}
          </motion.h2>

          <motion.h3
            className="mb-8 text-center text-xl font-light text-muted-foreground"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2.7 }}
          >
            {t('venue.subtitle')}
          </motion.h3>

          <motion.div 
            className="grid grid-cols-2 gap-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2.8 }}
          >
            {[1, 2, 3, 4].map((num) => (
              <img
                key={num}
                src={`/qplex${num}.jpeg`}
                alt={`Q-plex venue photo ${num}`}
                className="aspect-square w-full rounded-lg object-cover"
              />
            ))}
          </motion.div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="mb-24 px-4">
        <motion.h2
          className="mb-12 text-center text-3xl font-light tracking-wide"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.8 }}
        >
          {t('timeline.title')}
        </motion.h2>

        <div className="mx-auto max-w-4xl">
          <div className="relative">
            {timelineEvents.map((event, index) => (
              <TimelineEvent key={event.day} event={event} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      {/* <section className="mb-24 px-4">
        <div className="mx-auto max-w-6xl">
          <motion.div
            className="text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 3.2 }}
          >
            <h3 className="mb-2 text-xl font-light">{t('team.checkOut')}</h3>
            <h2 className="mb-12 text-3xl font-bold">{t('team.title')}</h2>
          </motion.div>

          <motion.div
            className="flex space-x-8 overflow-x-auto pb-8"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 3.4 }}
          >
            {[
              { name: 'Carry', role: t('team.roles.founder'), color: 'bg-accent' },
              { name: 'Alvin', role: t('team.roles.cofounder'), color: 'bg-secondary' },
              { name: 'Henry', role: t('team.roles.cofounder'), color: 'bg-primary' },
              { name: 'Corton', role: t('team.roles.cofounder'), color: 'bg-muted' }
            ].map((member, index) => (
              <div key={index} className="flex-none">
                <div className={`aspect-square w-48 overflow-hidden rounded-lg`}>
                  <div className={`flex h-full w-full items-center justify-center ${member.color} text-4xl font-bold text-white`}>
                    {member.name[0]}
                  </div>
                </div>
                <h3 className="mt-4 text-xl font-light">{member.name}</h3>
                <p className="text-muted-foreground">{member.role}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section> */}

      {/* CTA Section */}
      <section className="mb-12 px-4">
        <motion.div
          className="mx-auto max-w-3xl rounded-sm bg-primary/20 p-8 text-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 2.8 }}
        >
          <h2 className="mb-4 text-2xl font-light">{t('cta.title')}</h2>
          <p className="mb-6 text-muted-foreground">
            {t('cta.description')}
          </p>
          <Link
            to="/register"
            className="w-full rounded-sm border border-primary px-8 py-3 text-center font-light transition duration-300 ease-in-out hover:bg-primary/20 hover:border-primary hover:scale-105 hover:shadow-lg hover:shadow-primary/20 sm:w-auto"
          >
            {t('cta.register')}
          </Link>
        </motion.div>
      </section>
    </div>
  );
};

export default HomePage;
