'use client';

export default function Loader({ fullPage = false }) {
    return (
        <div className={`${fullPage
                ? 'fixed inset-0 z-[9999] bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm'
                : 'w-full py-12'
            } flex items-center justify-center transition-opacity duration-300`}>
            <div className="relative">
                {/* Glow Effect */}
                <div className="absolute inset-0 rounded-full bg-red-600/20 blur-xl animate-pulse-slow"></div>

                {/* Pulsing Favicon */}
                <div className="relative animate-float">
                    <img
                        src="/favicon.png"
                        alt="Loading..."
                        className="w-16 h-16 md:w-20 md:h-20 object-contain drop-shadow-2xl pulse-favicon"
                        onError={(e) => {
                            e.target.src = '/favicon.ico';
                        }}
                    />
                </div>
            </div>

            <style jsx global>{`
                @keyframes pulse-favicon {
                    0%, 100% {
                        transform: scale(1);
                        opacity: 1;
                    }
                    50% {
                        transform: scale(1.1);
                        opacity: 0.8;
                    }
                }

                @keyframes float {
                    0%, 100% {
                        transform: translateY(0);
                    }
                    50% {
                        transform: translateY(-10px);
                    }
                }

                @keyframes pulse-slow {
                    0%, 100% {
                        transform: scale(1);
                        opacity: 0.3;
                    }
                    50% {
                        transform: scale(1.5);
                        opacity: 0.1;
                    }
                }

                .pulse-favicon {
                    animation: pulse-favicon 2s ease-in-out infinite;
                }

                .animate-float {
                    animation: float 3s ease-in-out infinite;
                }

                .animate-pulse-slow {
                    animation: pulse-slow 3s ease-in-out infinite;
                }
            `}</style>
        </div>
    );
}
