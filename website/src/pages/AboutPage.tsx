import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import TimelineEvent, { TimelineEventData } from '../components/TimelineEvent';

const AboutPage = () => {
  const { t } = useTranslation();

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
    <div className="container mx-auto pt-[var(--s120)] md:pt-[var(--s200)]">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mx-auto max-w-4xl"
      >
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-20"
        >
          <h2 className="mb-6 text-2xl font-bold md:text-4xl">
            {t('about.hero.title1')}
            <br />
            <span className="text-primary">{t('about.hero.title2')}</span>
          </h2>
          <div className='line'></div>
        </motion.div>



        {/* Intro Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="mb-20 text-center"
        >
          <h2 className="mb-4 text-xl font-bold text-primary">{t('about.intro.title')}</h2>
          <p className="mb-4 text-xl">{t('about.intro.subtitle')}</p>
          <p className="text-xl text-muted-foreground">
            <span className="text-primary">{t('about.intro.text')}</span>
          </p>
        </motion.div>

        {/* Manifesto Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="mb-20 text-xl"
        >
          <p className="mb-4 text-secondary">{t('about.manifesto.line1')}</p>
          <p className="text-secondary">{t('about.manifesto.line2')}</p>
          <div className='line'></div>
        </motion.div>

        {/* What is TEENAIGERS Section */}
        <p className="text-h4 text-white pointer-events-none select-none">01</p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="mb-20"
        >
          <h2 className="mb-6 text-3xl font-bold">
            {t('about.what.title')}
          </h2>
          <div className="space-y-4 text-lg text-muted-foreground">
            <span>{t('about.what.description')}</span>
            <span className="text-primary">{t('about.what.highlight1')}</span>
            <span>{t('about.what.middle')}</span>


            <p>{t('about.what.extra')}
              <span className="text-primary">{t('about.what.highlight2')}</span>
            </p>
          </div>
        </motion.div>

        {/* Event Information Section */}
        <p className="text-h4 text-white pointer-events-none select-none">02</p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="mb-20"
        >
          <h2 className="mb-6 text-3xl font-bold text-primary">{t('about.event.title')}</h2>
          <div className="space-y-4 text-lg text-muted-foreground">
            <p>
              {t('about.event.intro')}

              <span className="text-primary">{t('about.event.highlight1')}</span>
              <span>{t('about.event.middle1')}</span>
            </p>

            <p>
              {t('about.event.theme')}

              <span className="text-primary">
                {t('about.event.highlight2')}
              </span>
              <span>
                {t('about.event.middle2')}
              </span>
              <span>
                {t('about.event.teams')}
              </span>
              <span className="text-primary">
                {t('about.event.highlight3')}
              </span>
            </p>
          </div>
        </motion.div>

        {/* Timeline Section */}
        <p className="text-h4 text-white pointer-events-none select-none">03</p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.8 }}
          className="mb-20"
        >
          <h2 className="mb-12 text-center text-3xl font-bold">{t('about.timeline.title')}</h2>
          <div className="relative">
            {timelineEvents.map((event, index) => (
              <TimelineEvent key={event.day} event={event} index={index} />
            ))}
          </div>
        </motion.div>

        {/* Experience Section */}
        <p className="text-h4 text-white pointer-events-none select-none">04</p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.8 }}
          className="mb-20"
        >
          <h2 className="mb-8 text-3xl font-bold text-secondary">{t('about.experience.title')}</h2>
          <div className="grid gap-8 md:grid-cols-2">
            <div className="space-y-6">
              <div>
                <h3 className="mb-2 text-xl font-semibold text-secondary">
                  {t('about.experience.workshops.title')}
                </h3>
                <p className="text-muted-foreground">
                  {t('about.experience.workshops.description')}
                  <span className="text-primary">
                    {t('about.experience.workshops.highlight')}
                  </span>
                  <span>
                    {t('about.experience.workshops.suffix')}
                  </span>
                </p>
              </div>
              <div>
                <h3 className="mb-2 text-xl font-semibold text-secondary">
                  {t('about.experience.mentors.title')}
                </h3>
                <p className="text-muted-foreground">
                  {t('about.experience.mentors.description')}
                  <span className="text-primary">
                    {t('about.experience.mentors.highlight1')}
                  </span>
                  <span>
                    {t('about.experience.mentors.middle')}
                  </span>
                  <span className="text-primary">
                    {t('about.experience.mentors.highlight2')}
                  </span>
                </p>
              </div>
              <div>
                <h3 className="mb-2 text-xl font-semibold text-secondary">
                  {t('about.experience.prizes.title')}
                </h3>
                <span className="text-muted-foreground">
                  {t('about.experience.prizes.description')}
                </span>
                <span className="text-primary">
                  {t('about.experience.prizes.highlight1')}
                </span>
                <span>
                  {t('about.experience.prizes.middle')}
                </span>
                <span className="text-primary">
                  {t('about.experience.prizes.highlight2')}
                </span>
              </div>
            </div>
            <div className="space-y-6">
              <div>
                <h3 className="mb-2 text-xl font-semibold text-secondary">
                  {t('about.experience.free.title')}
                </h3>
                <p className="text-muted-foreground">{t('about.experience.free.description')}</p>
              </div>
              <div>
                <h3 className="mb-2 text-xl font-semibold text-secondary">
                  {t('about.experience.accommodation.title')}
                </h3>
                <p className="text-muted-foreground">
                  {t('about.experience.accommodation.description')}
                  <span className="text-primary">
                    {t('about.experience.accommodation.highlight')}
                  </span>
                  <span>
                    {t('about.experience.accommodation.suffix')}
                  </span>
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Inclusivity Section */}
        <p className="text-h4 text-white pointer-events-none select-none">05</p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.8 }}
          className="mb-20"
        >
          <h2 className="mb-6 text-3xl font-bold text-primary">{t('about.inclusivity.title')}</h2>
          <div className="space-y-4 text-lg text-muted-foreground">
            <p>
              <span>{t('about.inclusivity.text1.prefix')}</span>
              <span className="text-primary">{t('about.inclusivity.text1.highlight1')}</span>
              <span>{t('about.inclusivity.text1.middle')}</span>
              <span className="text-primary">{t('about.inclusivity.text1.highlight2')}</span>
              <span>{t('about.inclusivity.text1.suffix')}</span>
            </p>

            <p>{t('about.inclusivity.text2.prefix')}
              <span className="text-primary">{t('about.inclusivity.text2.highlight')}</span>
              <span>{t('about.inclusivity.text2.suffix')}</span>
            </p>
          </div>
        </motion.div>

        {/* Organizations Section */}
        <p className="text-h4 text-white pointer-events-none select-none">06</p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.8 }}
          className="mb-20"
        >
          <h2 className="mb-6 text-3xl font-bold text-primary">{t('about.organizations.title')}</h2>
          <div className="space-y-4 text-lg text-muted-foreground">

            <p>
              <span>{t('about.organizations.text1.prefix')}</span>
              <span className="text-primary">{t('about.organizations.text1.highlight1')}</span>
              <span>{t('about.organizations.text1.middle')}</span>
              <span className="text-primary">{t('about.organizations.text1.highlight2')}</span>
              <span>{t('about.organizations.text1.suffix')}</span>
            </p>

            <p>
              <span>{t('about.organizations.text2.prefix')}</span>
              <span className="text-primary">{t('about.organizations.text2.highlight')}</span>
              <span>{t('about.organizations.text2.suffix')}</span>
            </p>
          </div>
        </motion.div>
      </motion.div>
    </div >
  );
};

export default AboutPage;
