import React from 'react';
import { Star } from 'tabler-icons-react';

const ReviewCarousel = ({ reviews }) => {
    // Render empty state or nothing if reviews missing, but don't block parent
    if (!reviews) return null;

    return (
        <section className="py-24 px-4 bg-malaga-900 text-malaga-50 relative overflow-hidden" id="reviews">
            {/* Decorative circles */}
            <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-malaga-800 opacity-20 blur-3xl" />
            <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 rounded-full bg-malaga-800 opacity-20 blur-3xl" />

            <div className="max-w-7xl mx-auto text-center relative z-10">
                <div className="mb-16">
                    <h2 className="text-4xl font-serif mb-6 italic">Historias de nuestros huéspedes</h2>
                    <div className="flex justify-center items-center gap-3 opacity-90">
                        <img
                            src="https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg"
                            alt="Google"
                            className="h-6 filter brightness-0 invert opacity-80"
                        />
                        <span className="text-xl font-light text-malaga-200">Reviews</span>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {reviews.map(review => (
                        <div key={review.id} className="bg-white/5 backdrop-blur-sm p-10 rounded-3xl text-left border border-white/10 hover:bg-white/10 transition-colors duration-300">
                            <div className="flex gap-1 mb-6 text-malaga-400">
                                {[...Array(5)].map((_, i) => (
                                    <Star
                                        key={i}
                                        size={18}
                                        fill={i < review.rating ? "currentColor" : "none"}
                                        stroke={i < review.rating ? "none" : "currentColor"}
                                    />
                                ))}
                            </div>
                            <p className="text-malaga-100 mb-8 italic text-lg leading-relaxed font-serif">"{review.comment}"</p>
                            <div className="flex items-center gap-4 border-t border-white/10 pt-6">
                                <div className="w-12 h-12 bg-malaga-700 rounded-full flex items-center justify-center font-bold text-white shadow-lg text-lg ring-2 ring-malaga-600 ring-offset-2 ring-offset-malaga-900">
                                    {review.user[0]}
                                </div>
                                <div>
                                    <p className="font-bold text-white tracking-wide">{review.user}</p>
                                    <p className="text-xs text-malaga-400 uppercase tracking-widest mt-1">{review.date}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default ReviewCarousel;
