import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useMemo } from 'react';
import TimelineEvent, { TimelineEventData } from '../components/TimelineEvent';

const TimelinePage = () => {
        const { t, ready } = useTranslation();

        // Memoize timeline events to prevent unnecessary recalculations
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
                                transition={{ duration: 0.4 }}
                                className="mx-auto max-w-4xl"
                        >
                                <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.2, duration: 0.6 }}
                                        className="mb-20 text-center"
                                >
                                        <h2 className="mb-6 text-3xl font-bold text-primary">
                                                {t('timeline.detailed.title')}
                                        </h2>
                                </motion.div>

                                <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: 0.3, duration: 0.6 }}
                                        className="relative"
                                >
                                        {timelineEvents.map((event, index) => (
                                                <TimelineEvent
                                                        key={`${event.day}-${index}`}
                                                        event={event}
                                                        index={index}
                                                />
                                        ))}
                                </motion.div>
                        </motion.div>
                </div>
        );
};

export default TimelinePage;
