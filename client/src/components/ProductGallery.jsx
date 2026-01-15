import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ProductGallery = ({ products, categories }) => {
    const [filter, setFilter] = useState('all');

    const filteredProducts = filter === 'all'
        ? products
        : products.filter(p => p.category_name === filter || p.category_id === parseInt(filter));

    return (
        <section className="py-24 px-4 bg-pattern bg-repeat" id="menu">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <span className="text-malaga-500 font-bold tracking-[0.3em] uppercase text-xs mb-3 block px-4">Nuestra Cocina</span>
                    <h2 className="text-5xl md:text-7xl font-serif font-black text-malaga-900 lowercase italic">Clásicos Curados</h2>
                </div>

                {/* Categories - Now Dynamic */}
                <div className="flex flex-wrap justify-center gap-4 mb-20 bg-white/50 backdrop-blur-sm p-4 rounded-3xl border border-malaga-200/50 w-fit mx-auto">
                    <button
                        onClick={() => setFilter('all')}
                        className={`px-8 py-3 rounded-2xl text-sm font-bold transition-all duration-300 ${filter === 'all' ? 'bg-malaga-600 text-white shadow-lg shadow-malaga-600/20' : 'text-malaga-600 hover:bg-malaga-100'
                            }`}
                    >
                        Todos
                    </button>
                    {categories.map(cat => (
                        <button
                            key={cat.id}
                            onClick={() => setFilter(cat.name)}
                            className={`px-8 py-3 rounded-2xl text-sm font-bold transition-all duration-300 ${filter === cat.name ? 'bg-malaga-600 text-white shadow-lg shadow-malaga-600/20' : 'text-malaga-600 hover:bg-malaga-100'
                                }`}
                        >
                            {cat.name}
                        </button>
                    ))}
                </div>

                {/* Product Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                    <AnimatePresence mode='popLayout'>
                        {filteredProducts.map((product) => (
                            <motion.div
                                layout
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ duration: 0.4 }}
                                key={product.id}
                                className="group bg-white rounded-[2.5rem] overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 border border-malaga-100 flex flex-col"
                            >
                                <div className="h-80 overflow-hidden relative">
                                    <img
                                        src={product.image_url}
                                        alt={product.name}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                </div>
                                <div className="p-10 space-y-4 flex-1 flex flex-col justify-between">
                                    <div>
                                        <span className="text-xs font-bold text-malaga-500 uppercase tracking-widest mb-2 block">{product.category_name}</span>
                                        <h3 className="text-3xl font-serif font-bold text-malaga-900 mb-3">{product.name}</h3>
                                        <p className="text-malaga-600 leading-relaxed font-light line-clamp-2">{product.description}</p>
                                    </div>

                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            </div>
        </section>
    );
};

export default ProductGallery;
