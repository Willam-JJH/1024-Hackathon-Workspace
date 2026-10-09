import React from 'react';
import { motion } from 'framer-motion';

export interface TimelineEventData {
        day: string;
        events: string[];
        isLeft: boolean;
        centered?: boolean;
        variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'error';
}

const variantStyles = {
        primary: {
                border: 'border-primary',
                bg: 'bg-primary/20',
                node: 'bg-primary'
        },
        secondary: {
                border: 'border-secondary',
                bg: 'bg-secondary/20',
                node: 'bg-secondary'
        },
        success: {
                border: 'border-green-500',
                bg: 'bg-green-500/20',
                node: 'bg-green-500'
        },
        warning: {
                border: 'border-yellow-500',
                bg: 'bg-yellow-500/20',
                node: 'bg-yellow-500'
        },
        error: {
                border: 'border-red-500',
                bg: 'bg-red-500/20',
                node: 'bg-red-500'
        }
};

interface TimelineEventProps {
        event: TimelineEventData;
        index: number;
}

const TimelineEvent = ({ event, index }: TimelineEventProps) => {
        const boxVariants = {
                hidden: {
                        opacity: 0,
                        ...(event.centered
                                ? { y: 50 }
                                : { x: event.isLeft ? -50 : 50 })
                },
                visible: {
                        opacity: 1,
                        ...(event.centered ? { y: 0 } : { x: 0 }),
                        transition: {
                                duration: 0.6,
                                delay: index * 0.2
                        }
                }
        };

        return (
                <div className={`relative flex ${event.centered ? 'justify-center' : event.isLeft ? 'justify-start' : 'justify-end'} w-full ${event.centered ? 'my-16' : 'mb-8'}`}>
                        {/* Vertical line in the middle */}
                        {/* <div className={`absolute left-1/2 h-full w-0.5 -translate-x-1/2 ${event.variant ? variantStyles[event.variant].bg : 'bg-hackathon-lightgray/30'}`} /> */}

                        {/* Timeline node - only show for non-centered events */}
                        {!event.centered && (
                                <div className={`absolute left-1/2 top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full ${event.variant ? variantStyles[event.variant].node : 'bg-hackathon-lightgray'}`} />
                        )}

                        <motion.div
                                className={`relative ${event.centered ? 'w-[60%]' : 'w-[45%]'} ${event.centered ? '' : event.isLeft ? 'mr-8' : 'ml-8'}`}
                                variants={boxVariants}
                                initial="hidden"
                                animate="visible"
                        >
                                {/* Day label with 90-degree rotation */}
                                <div
                                        className={`absolute ${event.centered ? 'left-1/2 -translate-x-1/2 -top-8' :
                                                event.isLeft ? '-left-16' : '-right-16'
                                                } ${event.centered ? '' : 'top-1/2 -translate-y-1/2'} transform text-xl font-light`}
                                >
                                        <div className={`${event.centered ? '' : event.isLeft ? 'rotate-[-90deg]' : 'rotate-[90deg]'} whitespace-nowrap`}>{event.day}</div>
                                </div>

                                {/* Content box */}
                                <div className={`rounded-[20px] p-6 border-2 ${event.variant
                                        ? `${variantStyles[event.variant].bg} ${variantStyles[event.variant].border}`
                                        : 'bg-hackathon-gray/20 border-hackathon-lightgray'
                                        }`}>
                                        <div className="space-y-2">
                                                {event.events.map((item, i) => (
                                                        <p key={i} className="text-gray-300">
                                                                {item}
                                                        </p>
                                                ))}
                                        </div>
                                </div>
                        </motion.div>
                </div>
        );
};

export default TimelineEvent;
