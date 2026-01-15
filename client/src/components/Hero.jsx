import React from 'react';
import { motion } from 'framer-motion';

const Hero = ({ settings }) => {
    // No strict return null, use optional chaining below

    return (
        <div className="relative h-screen min-h-[700px] flex items-center justify-center overflow-hidden">
            {/* Background with Overlay */}
            <div className="absolute inset-0 z-0">
                <img
                    src="https://images.unsplash.com/photo-1497935586351-b67a49e012bf?q=80&w=2000&auto=format&fit=crop"
                    alt="Malaga Coffee Atmosphere"
                    className="w-full h-full object-cover opacity-90"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-malaga-900/10 via-malaga-50/20 to-malaga-50" />
            </div>

            {/* Floating Glass Panel Content */}
            <div className="relative z-10 px-4 w-full max-w-5xl mx-auto flex flex-col items-center">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="text-center p-8 md:p-14 glass-panel rounded-3xl text-malaga-900 mx-4 max-w-3xl border-opacity-40 bg-white/85"
                >
                    <span className="block text-malaga-600 font-bold tracking-[0.2em] uppercase text-sm mb-4">
                        Sabores de Málaga
                    </span>
                    <h1 className="text-5xl md:text-8xl font-serif font-black mb-6 leading-tight text-malaga-900">
                        {settings?.title || "Latte & Me"}
                    </h1>
                    <p className="text-xl md:text-2xl font-light mb-10 text-malaga-800 max-w-2xl mx-auto leading-relaxed">
                        El rincón más dulce y viral de Málaga.
                    </p>

                    <div className="flex flex-col md:flex-row gap-4 justify-center">
                        <a
                            href={settings?.reservationUrl || '#'}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-malaga-600 hover:bg-malaga-700 text-white px-10 py-5 rounded-full text-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-malaga-500/30 hover:-translate-y-1 transform"
                        >
                            Reservar una Mesa
                        </a>
                        <a
                            href="#menu"
                            className="bg-transparent border-2 border-malaga-600 text-malaga-700 hover:bg-malaga-600 hover:text-white px-10 py-5 rounded-full text-lg font-semibold transition-all duration-300"
                        >
                            Ver Menú
                        </a>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default Hero;
