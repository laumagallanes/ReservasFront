import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../services/api';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await login(username, password);
            navigate('/admin');
        } catch (err) {
            setError('Invalid credentials');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-malaga-50 px-4">
            <div className="max-w-md w-full glass-panel p-10 rounded-3xl shadow-2xl bg-white/90">
                <div className="text-center mb-10">
                    <h2 className="text-3xl font-serif font-bold text-malaga-900 mb-2">Admin Login</h2>
                    <p className="text-malaga-600 italic">Manage your Mediterranean sanctuary</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {error && (
                        <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm border border-red-100 italic">
                            {error}
                        </div>
                    )}
                    <div>
                        <label className="block text-xs font-bold text-malaga-600 uppercase tracking-widest mb-2 px-1">Username</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full px-5 py-4 bg-malaga-100/50 border border-malaga-200 rounded-2xl focus:ring-2 focus:ring-malaga-400 focus:border-transparent outline-none transition-all"
                            placeholder="ADMINISTRATOR"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-malaga-600 uppercase tracking-widest mb-2 px-1">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-5 py-4 bg-malaga-100/50 border border-malaga-200 rounded-2xl focus:ring-2 focus:ring-malaga-400 focus:border-transparent outline-none transition-all"
                            placeholder="••••••••"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full py-5 bg-malaga-900 text-white rounded-2xl font-bold hover:bg-malaga-800 transition-all shadow-lg hover:shadow-malaga-900/20 active:scale-[0.98]"
                    >
                        Login to Dashboard
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;
