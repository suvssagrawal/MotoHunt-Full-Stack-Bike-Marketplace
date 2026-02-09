'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import BikeCard from '@/components/BikeCard';

export default function HomePage() {
    const [trendingBikes, setTrendingBikes] = useState([]);
    const [loading, setLoading] = useState(true);

    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

    useEffect(() => {
        fetchTrendingBikes();
    }, []);

    const fetchTrendingBikes = async () => {
        try {
            const res = await fetch(`${API_URL}/api/bikes/trending`);
            const data = await res.json();
            setTrendingBikes(data.bikes || []);
        } catch (error) {
            console.error('Failed to fetch trending bikes:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen">
            {/* Hero Section with Showroom Background */}
            <section className="relative h-[700px] flex items-center justify-center overflow-hidden">
                {/* Background Image - Aesthetic Showroom */}
                <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{
                        backgroundImage: "url('https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1920&q=80')",
                    }}
                />

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-orange-900/40" />

                {/* Animated Glow */}
                <div className="absolute inset-0 bg-gradient-to-t from-amber-500/20 via-transparent to-transparent animate-pulse-slow" />

                {/* Content */}
                <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
                    {/* Ultra-Modern Glassmorphic Card with 3D Effects */}
                    <div className="glass-3d neon-border rounded-3xl p-12 shadow-glow animate-glow">
                        <div className="inline-block mb-6">
                            <span className="bg-gradient-to-r from-amber-400 via-orange-500 to-amber-400 text-white px-8 py-3 rounded-full text-sm font-bold tracking-widest shadow-glow animate-float text-glow border-animate">
                                🏍️ INDIA'S #1 PREMIUM BIKE PLATFORM
                            </span>
                        </div>

                        <h1 className="text-6xl md:text-8xl font-black mb-8 animate-fade-in">
                            <span className="gradient-text text-glow">Find Your Perfect Ride</span>
                        </h1>

                        <p className="text-xl md:text-2xl text-gray-200 mb-12 font-light animate-slide-up leading-relaxed">
                            Explore <span className="text-amber-400 font-semibold">premium motorcycles</span> with detailed specs,
                            <br className="hidden md:block" />
                            side-by-side comparisons, and instant test ride bookings
                        </p>

                        <div className="flex flex-col sm:flex-row gap-6 justify-center animate-slide-up">
                            <Link
                                href="/bikes"
                                className="group relative gradient-primary text-white px-12 py-5 rounded-xl font-bold text-lg overflow-hidden shadow-glow-hover btn-magnetic"
                            >
                                <span className="relative z-10">Browse Collection</span>
                                <div className="absolute inset-0 bg-white/20 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
                            </Link>

                            <Link
                                href="/compare"
                                className="glass-strong text-white px-12 py-5 rounded-xl font-bold text-lg border-2 border-amber-500/60 hover:border-amber-400 shadow-glow-hover btn-magnetic neon-border"
                            >
                                Compare Bikes
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Scroll Indicator */}
                <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
                    <div className="w-6 h-10 border-2 border-amber-500 rounded-full flex items-start justify-center p-1">
                        <div className="w-1 h-2 bg-amber-500 rounded-full" />
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="max-w-7xl mx-auto px-4 py-16 -mt-20 relative z-20">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <StatCard number="8+" label="Premium Bikes" icon="🏍️" />
                    <StatCard number="6" label="Top Brands" icon="⭐" />
                    <StatCard number="1000+" label="Happy Riders" icon="😊" />
                </div>
            </section>

            {/* Trending Bikes Section */}
            <section className="max-w-7xl mx-auto px-4 py-16">
                <div className="flex items-center justify-between mb-10">
                    <div>
                        <h2 className="text-4xl md:text-5xl font-black text-white mb-2">
                            <span className="gradient-text">🔥 Trending Now</span>
                        </h2>
                        <p className="text-gray-400 text-lg">The hottest rides this month</p>
                    </div>
                    <Link
                        href="/bikes"
                        className="hidden md:flex items-center gap-2 text-amber-500 hover:text-amber-400 font-semibold text-lg group"
                    >
                        View All
                        <span className="transform group-hover:translate-x-1 transition-transform">→</span>
                    </Link>
                </div>

                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="h-96 glass rounded-2xl shimmer" />
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {trendingBikes.map((bike) => (
                            <BikeCard key={bike.id} bike={bike} />
                        ))}
                    </div>
                )}
            </section>

            {/* Features Section */}
            <section className="max-w-7xl mx-auto px-4 py-20">
                <h2 className="text-4xl md:text-5xl font-black text-center mb-4">
                    <span className="gradient-text">Why Choose MotoHunt?</span>
                </h2>
                <p className="text-center text-gray-400 text-lg mb-16">
                    Experience the future of motorcycle discovery
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <FeatureCard
                        icon="🔍"
                        title="Smart Search"
                        description="Advanced filters for price, mileage, top speed, and more with instant results"
                    />
                    <FeatureCard
                        icon="⚖️"
                        title="Easy Comparison"
                        description="Side-by-side comparison of all specs with visual indicators"
                    />
                    <FeatureCard
                        icon="📅"
                        title="Instant Booking"
                        description="Book test rides with verified dealers across India in seconds"
                    />
                </div>
            </section>

            {/* CTA Section */}
            <section className="max-w-5xl mx-auto px-4 py-20">
                <div className="glass-strong rounded-3xl p-12 text-center shadow-glow">
                    <h2 className="text-4xl md:text-5xl font-black mb-6">
                        <span className="gradient-text">Ready to Find Your Dream Bike?</span>
                    </h2>
                    <p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto">
                        Join thousands of riders who trust MotoHunt for their perfect motorcycle match
                    </p>
                    <Link
                        href="/register"
                        className="inline-block gradient-primary text-white px-12 py-5 rounded-xl font-bold text-lg shadow-glow-hover"
                    >
                        Get Started Free
                    </Link>
                </div>
            </section>
        </div>
    );
}

function StatCard({ number, label, icon }) {
    return (
        <div className="glass-3d rounded-2xl p-10 text-center card-hover shadow-glow-hover neon-border">
            <div className="text-6xl mb-4 animate-float">{icon}</div>
            <div className="text-5xl font-black gradient-text mb-3 text-glow">{number}</div>
            <div className="text-gray-300 font-semibold text-lg">{label}</div>
        </div>
    );
}

function FeatureCard({ icon, title, description }) {
    return (
        <div className="group glass-3d rounded-2xl p-10 card-hover border border-gray-700/50 hover:border-amber-500/70 shadow-glow-hover neon-border">
            <div className="text-7xl mb-6 transform group-hover:scale-125 group-hover:rotate-12 transition-all duration-500">{icon}</div>
            <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-amber-400 transition-colors gradient-text">
                {title}
            </h3>
            <p className="text-gray-300 leading-relaxed text-lg">{description}</p>
        </div>
    );
}
