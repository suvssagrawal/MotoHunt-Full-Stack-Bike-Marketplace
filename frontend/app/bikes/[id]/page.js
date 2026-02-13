'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import ImageGallery from '@/components/ImageGallery';
import RelatedBikes from '@/components/RelatedBikes';
import ShareButton from '@/components/ShareButton';

export default function BikeDetailPage() {
    const { id } = useParams();
    const router = useRouter();
    const { user } = useAuth();

    const [bike, setBike] = useState(null);
    const [selectedColor, setSelectedColor] = useState(null);
    const [bookingDate, setBookingDate] = useState('');
    const [loading, setLoading] = useState(true);
    const [bookingLoading, setBookingLoading] = useState(false);
    const [bookingSuccess, setBookingSuccess] = useState(false);
    const [bookingError, setBookingError] = useState('');

    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

    useEffect(() => {
        fetchBikeDetails();
    }, [id]);

    const fetchBikeDetails = async () => {
        try {
            const res = await fetch(`${API_URL}/api/bikes/${id}`);
            const data = await res.json();
            setBike(data.bike);
            // Set first color as default
            if (data.bike?.color_options) {
                const colors = data.bike.color_options.split(',');
                setSelectedColor(colors[0].trim());
            }
        } catch (error) {
            console.error('Failed to fetch bike details:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleBookTestRide = async (e) => {
        e.preventDefault();

        if (!user) {
            router.push('/login');
            return;
        }

        setBookingLoading(true);
        setBookingError('');

        try {
            const res = await fetch(`${API_URL}/api/test-rides`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({
                    bike_id: id,
                    booking_date: bookingDate,
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Booking failed');
            }

            setBookingSuccess(true);
            setTimeout(() => router.push('/dashboard'), 2000);
        } catch (error) {
            setBookingError(error.message);
        } finally {
            setBookingLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="text-8xl mb-6 animate-bounce">🏍️</div>
                    <p className="text-gray-400 text-xl">Loading bike details...</p>
                </div>
            </div>
        );
    }

    if (!bike) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <p className="text-gray-400 text-xl mb-4">Bike not found</p>
                    <Link href="/bikes" className="text-amber-500 hover:text-amber-400">
                        ← Back to Browse
                    </Link>
                </div>
            </div>
        );
    }

    const colors = bike.color_options ? bike.color_options.split(',').map(c => c.trim()) : [];
    const colorMap = {
        'Red': '#ef4444',
        'Black': '#1f2937',
        'Blue': '#3b82f6',
        'White': '#f3f4f6',
        'Orange': '#f97316',
        'Green': '#22c55e',
        'Yellow': '#facc15',
        'Gray': '#6b7280',
        'Maroon': '#881337'
    };

    return (
        <div className="min-h-screen pb-20">
            <div className="max-w-7xl mx-auto px-4 py-12">
                <div className="mb-8">
                    {/* Breadcrumbs */}
                    <nav className="flex items-center gap-2 text-sm text-gray-400 mb-6">
                        <Link href="/" className="hover:text-amber-500 transition-colors">Home</Link>
                        <span>/</span>
                        <Link href="/bikes" className="hover:text-amber-500 transition-colors">Bikes</Link>
                        <span>/</span>
                        <span className="text-white font-medium">{bike.model_name}</span>
                    </nav>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
                    {/* Left Column: Gallery */}
                    <div className="space-y-4">
                        <div className="sticky top-24">
                            <ImageGallery
                                images={bike.image_url ? [bike.image_url, bike.image_url] : []}
                                modelName={bike.model_name}
                            />
                        </div>
                    </div>

                    {/* Right Column: Key Info & Booking */}
                    <div>
                        <div className="flex items-start justify-between mb-6">
                            <div>
                                <h1 className="text-5xl font-black text-white mb-3 leading-tight">
                                    {bike.model_name}
                                </h1>
                                <p className="text-2xl text-gray-400 font-medium flex items-center gap-2">
                                    <span className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-sm">
                                        🏢
                                    </span>
                                    {bike.brand_name}
                                </p>
                            </div>
                            <div className="flex flex-col items-end gap-3">
                                {bike.is_trending === 1 && (
                                    <span className="gradient-primary text-white px-5 py-2.5 rounded-full text-sm font-bold shadow-glow animate-pulse-slow">
                                        🔥 TRENDING
                                    </span>
                                )}
                                <div className="flex gap-2">
                                    <ShareButton
                                        title={`Check out the ${bike.model_name} on MotoHunt!`}
                                        text={`Look at this amazing ${bike.model_name} by ${bike.brand_name}. Price: ₹${(bike.price_on_road / 100000).toFixed(2)}L`}
                                    />
                                    <button
                                        onClick={(e) => {
                                            e.preventDefault();
                                            // Assuming toggleWishlist is available via context in this page if we import it
                                            // But standard page implementation didn't import hook yet. 
                                            // Ideally we should use the hook here too or reuse the simplified Heart logic if we want.
                                            // For now, let's leave just Share button here as requested.
                                        }}
                                        className="glass p-3 rounded-full hover:glass-strong transition-all text-gray-300 hover:text-red-500 hidden"
                                    >
                                        ❤️
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Price Card */}
                        <div className="glass-strong rounded-2xl border border-amber-500/30 p-8 mb-8 shadow-glow relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                <span className="text-9xl font-black">₹</span>
                            </div>
                            <p className="text-gray-400 mb-2 text-lg font-medium">Ex-Showroom Price</p>
                            <div className="flex items-baseline gap-2">
                                <p className="text-6xl font-black gradient-text">
                                    ₹{(bike.price_on_road / 100000).toFixed(2)}L
                                </p>
                                <span className="text-gray-500 font-medium">*On-road estimates may vary</span>
                            </div>
                        </div>

                        {/* Quick Key Specs */}
                        <div className="grid grid-cols-4 gap-4 mb-8">
                            {[
                                { label: 'Power', value: `${bike.engine_cc}cc`, icon: '⚙️' },
                                { label: 'Mileage', value: `${bike.mileage}km/l`, icon: '🌿' },
                                { label: 'Speed', value: `${bike.top_speed}km/h`, icon: '⚡' },
                                { label: 'Weight', value: `${bike.weight}kg`, icon: '⚖️' }
                            ].map((spec, i) => (
                                <div key={i} className="glass rounded-xl p-3 text-center border border-white/5 hover:border-amber-500/30 transition-colors">
                                    <div className="text-xl mb-1">{spec.icon}</div>
                                    <div className="text-xs text-gray-400 mb-1">{spec.label}</div>
                                    <div className="font-bold text-white text-sm sm:text-base">{spec.value}</div>
                                </div>
                            ))}
                        </div>

                        {/* Color Selection */}
                        {colors.length > 0 && (
                            <div className="mb-8">
                                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                                    Available Colors
                                    <span className="text-gray-500 text-sm font-normal">({colors.length} options)</span>
                                </h3>
                                <div className="flex gap-4 flex-wrap">
                                    {colors.map((color) => (
                                        <button
                                            key={color}
                                            onClick={() => setSelectedColor(color)}
                                            className={`relative group transition-all ${selectedColor === color ? 'scale-110' : 'hover:scale-105'}`}
                                            title={color}
                                        >
                                            <div
                                                className={`w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-all ${selectedColor === color
                                                    ? 'ring-4 ring-amber-500 ring-offset-4 ring-offset-gray-900'
                                                    : 'ring-2 ring-gray-700'
                                                    }`}
                                                style={{ backgroundColor: colorMap[color] || '#6b7280' }}
                                            >
                                                {selectedColor === color && <span className="text-white drop-shadow-md">✓</span>}
                                            </div>
                                            <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-xs font-medium text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity bg-black/80 px-2 py-1 rounded whitespace-nowrap pointer-events-none">
                                                {color}
                                            </span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Short Description Placeholder */}
                        <p className="text-gray-300 leading-relaxed mb-8 border-l-4 border-amber-500 pl-4 italic">
                            Experience the thrill of the {bike.model_name}. Designed for those who demand performance, style, and reliability on every ride.
                        </p>

                        {/* Booking Section embedded here for desktop */}
                        <div className="hidden lg:block glass-strong rounded-2xl border border-white/10 p-6">
                            <h3 className="font-bold text-xl mb-4">Interested?</h3>
                            <button
                                onClick={() => document.getElementById('booking-section').scrollIntoView({ behavior: 'smooth' })}
                                className="w-full gradient-primary text-white font-bold py-4 rounded-xl shadow-glow-hover btn-magnetic flex items-center justify-center gap-2"
                            >
                                <span>📅</span> Book a Test Ride
                            </button>
                        </div>
                    </div>
                </div>

                {/* Content Tabs */}
                <div className="mb-12">
                    <div className="glass rounded-2xl p-2 mb-8 inline-flex gap-2">
                        {['specifications', 'features', 'reviews'].map((tab) => (
                            <button
                                key={tab}
                                // Simple state for now, could be enhanced
                                className={`px-6 py-3 rounded-xl font-bold capitalize transition-all ${'specifications' === tab
                                    ? 'bg-amber-500 text-black shadow-lg'
                                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                                    }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in relative">
                        <div className="absolute -inset-4 bg-amber-500/10 blur-3xl rounded-full opacity-20 pointer-events-none"></div>

                        {/* Engine */}
                        <SpecCard icon="⚙️" label="Engine Capacity" value={`${bike.engine_cc}cc`} color="text-blue-400" />
                        {/* Mileage */}
                        {bike.mileage && <SpecCard icon="🌿" label="Mileage" value={`${bike.mileage} km/l`} color="text-green-400" />}
                        {/* Top Speed */}
                        {bike.top_speed && <SpecCard icon="🏁" label="Top Speed" value={`${bike.top_speed} km/h`} color="text-amber-400" />}
                        {/* Weight */}
                        {bike.weight && <SpecCard icon="⚖️" label="Weight" value={`${bike.weight} kg`} color="text-purple-400" />}
                        {/* Fuel Capacity */}
                        {bike.fuel_capacity && <SpecCard icon="⛽" label="Fuel Tank" value={`${bike.fuel_capacity} L`} color="text-red-400" />}
                        {/* Gears */}
                        {bike.gears && <SpecCard icon="🔧" label="Transmission" value={`${bike.gears} Speed`} color="text-cyan-400" />}
                        {/* Type */}
                        <SpecCard icon="🏍️" label="Body Type" value={bike.type} color="text-orange-400" />
                        {/* Country */}
                        {bike.country_of_origin && <SpecCard icon="🌍" label="Origin" value={bike.country_of_origin} color="text-indigo-400" />}
                    </div>
                </div>

                {/* Test Ride Booking (Sticky-ish target) */}
                <div id="booking-section" className="scroll-mt-32 max-w-3xl mx-auto">
                    <div className="glass-strong rounded-3xl border border-amber-500/30 p-10 shadow-glow">
                        <h2 className="text-3xl font-black text-white mb-6 text-center">
                            <span className="gradient-text">Book Your Test Ride</span>
                        </h2>

                        {bookingSuccess ? (
                            <div className="glass border border-green-500 text-green-400 px-6 py-4 rounded-2xl text-center">
                                <div className="text-5xl mb-4">✅</div>
                                <p className="text-lg font-semibold">
                                    Test ride booked successfully!
                                </p>
                                <p className="text-sm text-gray-400 mt-2">
                                    Redirecting to dashboard...
                                </p>
                            </div>
                        ) : (
                            <form onSubmit={handleBookTestRide} className="space-y-6">
                                {bookingError && (
                                    <div className="glass border border-red-500 text-red-400 px-6 py-4 rounded-2xl">
                                        {bookingError}
                                    </div>
                                )}

                                <div>
                                    <label className="block text-gray-300 mb-3 font-semibold text-lg">
                                        Select Date
                                    </label>
                                    <input
                                        type="date"
                                        value={bookingDate}
                                        onChange={(e) => setBookingDate(e.target.value)}
                                        min={new Date().toISOString().split('T')[0]}
                                        className="w-full glass border border-gray-600 rounded-xl px-6 py-4 text-white focus:border-amber-500 focus:outline-none text-lg"
                                        required
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={bookingLoading}
                                    className="w-full gradient-primary text-white font-bold py-5 rounded-xl text-lg shadow-glow-hover disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {bookingLoading ? (
                                        <span className="flex items-center justify-center gap-3">
                                            <span className="animate-spin">⏳</span>
                                            Booking...
                                        </span>
                                    ) : (
                                        '🏍️ Book Test Ride Now'
                                    )}
                                </button>

                                {!user && (
                                    <p className="text-sm text-gray-400 text-center">
                                        Please{' '}
                                        <Link href="/login" className="text-amber-500 hover:text-amber-400 font-semibold">
                                            login
                                        </Link>
                                        {' '}to book a test ride
                                    </p>
                                )}
                            </form>
                        )}
                    </div>
                </div>

                {/* Related Bikes */}
                <RelatedBikes
                    currentBikeId={id}
                    type={bike.type}
                    price={bike.price_on_road}
                />
            </div>
        </div>
    );
}

function SpecCard({ icon, label, value, color }) {
    return (
        <div className="glass rounded-2xl p-6 border border-gray-700 hover:border-amber-500/50 transition-all group card-hover">
            <div className={`text-4xl mb-4 transform group-hover:scale-110 transition-transform`}>
                {icon}
            </div>
            <p className="text-gray-400 text-sm mb-2">{label}</p>
            <p className={`text-2xl font-bold ${color}`}>{value}</p>
        </div>
    );
}
