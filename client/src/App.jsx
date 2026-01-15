import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { getSettings, getProducts, getEvents, getReviews, getCategories } from './services/api';
import Hero from './components/Hero';
import ProductGallery from './components/ProductGallery';
import EventSection from './components/EventSection';
import ReviewCarousel from './components/ReviewCarousel';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import { Download, BrandInstagram, BrandFacebook } from 'tabler-icons-react';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
    const token = localStorage.getItem('token');
    return token ? children : <Navigate to="/login" />;
};

function Home({ settings, products, events, reviews, categories }) {
    return (
        <div className="min-h-screen bg-malaga-50 font-sans text-malaga-900 selection:bg-malaga-300">
            <Hero settings={settings} />
            <ProductGallery products={products} categories={categories} />
            <EventSection events={events} settings={settings} />
            <ReviewCarousel reviews={reviews} />

            {/* Modern Footer */}
            <footer className="bg-malaga-100 pt-20 pb-10 px-4 border-t border-malaga-200">
                <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 mb-16">
                    <div className="text-center md:text-left space-y-6">
                        <span className="text-3xl font-serif font-bold text-malaga-900 block">{settings?.title}</span>
                        <p className="text-malaga-600 max-w-xs mx-auto md:mx-0 leading-relaxed">
                            El rincón más dulce y viral de Málaga. Servido con pasión y calidez mediterránea.
                        </p>
                    </div>

                    <div className="text-center space-y-4">
                        <h4 className="font-bold text-malaga-800 uppercase tracking-widest text-sm mb-6">Contáctanos</h4>
                        <div className="flex flex-col gap-2 text-malaga-600">
                            <a href={`tel:${settings?.contact?.phone}`} className="hover:text-malaga-900 transition-colors">{settings?.contact?.phone}</a>
                            <a href={`mailto:${settings?.contact?.email}`} className="hover:text-malaga-900 transition-colors">{settings?.contact?.email}</a>
                            <p>{settings?.contact?.address}</p>
                        </div>
                    </div>

                    <div className="flex flex-col items-center md:items-end gap-4">
                        <a href={settings?.reservationUrl} target="_blank" rel="noopener noreferrer" className="w-full md:w-auto text-center px-8 py-4 bg-malaga-900 hover:bg-malaga-800 text-white rounded-xl transition-all shadow-lg font-medium">
                            Reservar una Mesa
                        </a>
                        <button className="w-full md:w-auto flex justify-center items-center gap-2 px-8 py-4 bg-white hover:bg-malaga-50 text-malaga-800 rounded-xl transition-all shadow-md border border-malaga-200 font-medium">
                            <Download size={20} />
                            Descargar Menú
                        </button>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto border-t border-malaga-200/50 pt-8 flex flex-col md:flex-row justify-between items-center gap-6">
                    <p className="text-malaga-500 text-sm">© {new Date().getFullYear()} {settings?.title}. Todos los derechos reservados.</p>
                    <div className="flex gap-6">
                        <a href={settings?.social?.instagram} className="text-malaga-400 hover:text-malaga-700 transition-colors"><BrandInstagram size={24} /></a>
                        <a href={settings?.social?.facebook} className="text-malaga-400 hover:text-malaga-700 transition-colors"><BrandFacebook size={24} /></a>
                    </div>
                </div>
            </footer>
        </div>
    );
}

function App() {
    const [settings, setSettings] = useState(null);
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [events, setEvents] = useState([]);
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch each separately to be resilient
                getSettings().then(setSettings).catch(e => console.error("Settings fail", e));
                getProducts().then(setProducts).catch(e => console.error("Products fail", e));
                getEvents().then(setEvents).catch(e => console.error("Events fail", e));
                getReviews().then(setReviews).catch(e => console.error("Reviews fail", e));
                getCategories().then(setCategories).catch(e => console.error("Categories fail", e));
            } catch (error) {
                console.error("Critical fetch error", error);
            } finally {
                // Short delay to allow some data to arrive
                setTimeout(() => setLoading(false), 500);
            }
        };
        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-malaga-50">
                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-malaga-600"></div>
            </div>
        );
    }

    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home settings={settings} products={products} events={events} reviews={reviews} categories={categories} />} />
                <Route path="/login" element={<Login />} />
                <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
            </Routes>
        </Router>
    );
}

export default App;
