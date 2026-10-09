import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useMemo } from 'react';
import TimelineEvent, { TimelineEventData } from '../components/TimelineEvent';

const TimelinePage = () => {
        const { t, ready } = useTranslation();

        // memo timeline
        const timelineEvents: TimelineEventData[] = useMemo(() => {
                const events = [
                        {
                                day: t('timeline.detailed.offline1.title'),
                                events: t('timeline.detailed.offline1.events', { returnObjects: true }) as string[],
                                isLeft: true,
                                variant: 'primary' as const
                        },
                        {
                                day: t('timeline.detailed.offline2.title'),
                                events: t('timeline.detailed.offline2.events', { returnObjects: true }) as string[],
                                isLeft: false,
                                variant: 'primary' as const
                        },
                        {
                                day: t('timeline.detailed.offline3.title'),
                                events: t('timeline.detailed.offline3.events', { returnObjects: true }) as string[],
                                isLeft: true,
                                variant: 'primary' as const
                        },
                        {
                                day: t('timeline.detailed.online.title'),
                                events: t('timeline.detailed.online.events', { returnObjects: true }) as string[],
                                isLeft: false,
                                centered: true,
                                variant: 'secondary' as const
                        },
                        {
                                day: t('timeline.detailed.offline4.title'),
                                events: t('timeline.detailed.offline4.events', { returnObjects: true }) as string[],
                                isLeft: false,
                                variant: 'primary' as const
                        },
                        {
                                day: t('timeline.detailed.offline5.title'),
                                events: t('timeline.detailed.offline5.events', { returnObjects: true }) as string[],
                                isLeft: true,
                                variant: 'primary' as const
                        }
                ];

                return events;
        }, [t]);

        // Show loading state while translations are loading
        if (!ready) {
                return (
                        <div className="container mx-auto pt-[var(--s120)] md:pt-[var(--s200)]">
                                <div className="flex h-[60vh] items-center justify-center">
                                        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
                                </div>
                        </div>
                );
        }

        return (
                <div className="container mx-auto pt-[var(--s120)] md:pt-[var(--s200)]">
                        <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.6 }}
                                className="mx-auto max-w-4xl"
                        >

                                <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.5, duration: 0.8 }}
                                        className="mb-20"
                                >
                                        <h2 className="mb-6 text-3xl font-bold">
                                                {t('timeline.events.title')}
                                        </h2>
                                        <div className="space-y-4 text-lg text-muted-foreground">
                                                <div className="relative">
                                                        {timelineEvents.map((event, index) => (
                                                                <div key={`timeline-${index}`} className="mb-6">
                                                                        <h2 className="text-2xl font-semibold mb-2">{event.day}</h2>
                                                                        {Array.isArray(event.events) ? (
                                                                                event.events.map((item, itemIndex) => (
                                                                                        <p key={`event-${index}-${itemIndex}`} className="text-primary mb-1">
                                                                                                {item}
                                                                                        </p>
                                                                                ))
                                                                        ) : (
                                                                                <p className="text-primary">{event.events}</p>
                                                                        )}
                                                                        <div className='line'></div>
                                                                </div>
                                                        ))}
                                                </div>
                                        </div>
                                </motion.div>


                                {/* Timeline Section */}
                                {/* <p className="text-h4 text-white pointer-events-none select-none">01</p> */}
                                {/* <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.4, duration: 0.8 }}
                                        className="mb-20"
                                >
                                        <h2 className="mb-12 text-3xl font-bold">{t('timeline.events.title')}</h2>
                                        <div className="relative">
                                                {timelineEvents.map((event, index) => (
                                                        <TimelineEvent
                                                                key={`${event.day}-${index}`}
                                                                event={event}
                                                                index={index}
                                                        />
                                                ))}
                                        </div>
                                </motion.div> */}

                                {/* Conclusion Section
                                <p className="text-h4 text-white pointer-events-none select-none">02</p>
                                <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.5, duration: 0.8 }}
                                        className="mb-20"
                                >
                                        <h2 className="mb-6 text-3xl font-bold text-primary">{t('timeline.conclusion.title')}</h2>
                                        <div className="space-y-4 text-lg text-muted-foreground">
                                                <p>{t('timeline.conclusion.description')}</p>
                                        </div>
                                </motion.div> */}
                        </motion.div>
                </div>
        );
};

export default TimelinePage;
