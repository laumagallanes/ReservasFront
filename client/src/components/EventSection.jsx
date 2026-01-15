import React from 'react';
import { Calendar } from 'tabler-icons-react';

const EventSection = ({ events, settings }) => {
    if (!events) return null;

    return (
        <section className="py-24 px-4 bg-white" id="events">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <span className="text-malaga-olive font-bold tracking-widest uppercase text-xs mb-2 block">Sucediendo Ahora</span>
                    <h2 className="text-5xl font-serif font-bold text-malaga-900 mb-8 italic">Próximos Momentos</h2>
                </div>

                <div className="space-y-20">
                    {events.map((event, index) => (
                        <div
                            key={event.id}
                            className={`flex flex-col md:flex-row items-center gap-12 group ${index % 2 !== 0 ? 'md:flex-row-reverse' : ''}`}
                        >
                            <div className="w-full md:w-1/2 h-96 relative rounded-3xl overflow-hidden shadow-2xl">
                                <div className="absolute inset-0 bg-malaga-900/20 group-hover:bg-transparent transition-all duration-500 z-10" />
                                <img
                                    src={event.image}
                                    alt={event.title}
                                    className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-105"
                                />
                            </div>
                            <div className="w-full md:w-1/2 space-y-6 text-center md:text-left">
                                <div className="inline-flex items-center gap-3 text-malaga-olive font-semibold bg-malaga-50 px-6 py-3 rounded-full border border-malaga-100">
                                    <Calendar size={20} />
                                    <span className="tracking-wide text-capitalize">{new Date(event.date).toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                                </div>
                                <h3 className="text-4xl font-serif font-bold text-malaga-900 leading-tight">{event.title}</h3>
                                <p className="text-malaga-600 text-lg leading-relaxed font-light">{event.description}</p>
                                <a
                                    href={settings?.reservationUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-malaga-500 font-bold uppercase tracking-widest text-xs border-b-2 border-malaga-300 pb-1 hover:text-malaga-700 hover:border-malaga-600 transition-colors inline-block mt-4"
                                >
                                    Reserva tu Lugar
                                </a>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default EventSection;
