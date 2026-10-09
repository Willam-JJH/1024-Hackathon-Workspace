import { motion } from 'framer-motion';

const Loading = () => {
        return (
                <div className="flex h-screen items-center justify-center">
                        <motion.div
                                className="flex flex-col items-center"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.5 }}
                        >
                                {/* Binary rain effect container */}
                                <div className="relative h-24 w-24">
                                        <motion.div
                                                className="absolute inset-0 rounded-full border-2 border-primary"
                                                animate={{
                                                        scale: [1, 1.2, 1],
                                                        opacity: [1, 0.5, 1],
                                                }}
                                                transition={{
                                                        duration: 2,
                                                        repeat: Infinity,
                                                        ease: "linear"
                                                }}
                                        />
                                        {/* Binary numbers falling effect */}
                                        <div className="absolute inset-0 overflow-hidden">
                                                {[...Array(10)].map((_, i) => (
                                                        <motion.div
                                                                key={i}
                                                                className="absolute text-xs font-mono text-primary"
                                                                initial={{
                                                                        top: -20,
                                                                        left: `${Math.random() * 100}%`,
                                                                        opacity: 0
                                                                }}
                                                                animate={{
                                                                        top: "120%",
                                                                        opacity: [0, 1, 0]
                                                                }}
                                                                transition={{
                                                                        duration: 2,
                                                                        repeat: Infinity,
                                                                        delay: i * 0.2,
                                                                        ease: "linear"
                                                                }}
                                                        >
                                                                {Math.random() > 0.5 ? "1" : "0"}
                                                        </motion.div>
                                                ))}
                                        </div>
                                </div>

                                <motion.div
                                        className="mt-4 text-center font-mono text-primary"
                                        animate={{
                                                opacity: [0.5, 1, 0.5],
                                        }}
                                        transition={{
                                                duration: 1.5,
                                                repeat: Infinity,
                                                ease: "linear"
                                        }}
                                >
                                        LOADING...
                                </motion.div>
                        </motion.div>
                </div>
        );
};

export default Loading;