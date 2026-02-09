'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';

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
                <Link
                    href="/bikes"
                    className="inline-flex items-center gap-2 text-gray-400 hover:text-amber-500 mb-8 group"
                >
                    <span className="transform group-hover:-translate-x-1 transition-transform">←</span>
                    Back to Browse
                </Link>

                {/* Header Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
                    {/* Image Section */}
                    <div className="space-y-4">
                        <div className="glass-strong rounded-3xl overflow-hidden border border-gray-700 shadow-glow">
                            {bike.image_url ? (
                                <img
                                    src={bike.image_url}
                                    alt={bike.model_name}
                                    className="w-full h-[500px] object-cover"
                                />
                            ) : (
                                <div className="w-full h-[500px] flex items-center justify-center text-9xl">
                                    🏍️
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Details Section */}
                    <div>
                        <div className="flex items-start justify-between mb-6">
                            <div>
                                <h1 className="text-5xl font-black text-white mb-3">
                                    {bike.model_name}
                                </h1>
                                <p className="text-2xl text-gray-400 font-medium">{bike.brand_name}</p>
                            </div>
                            {bike.is_trending === 1 && (
                                <span className="gradient-primary text-white px-5 py-2.5 rounded-full text-sm font-bold shadow-glow animate-pulse-slow">
                                    🔥 TRENDING
                                </span>
                            )}
                        </div>

                        {/* Price Card */}
                        <div className="glass-strong rounded-2xl border border-amber-500/30 p-8 mb-6 shadow-glow">
                            <p className="text-gray-400 mb-3 text-lg">On-Road Price</p>
                            <p className="text-6xl font-black gradient-text">
                                ₹{(bike.price_on_road / 100000).toFixed(2)}L
                            </p>
                        </div>

                        {/* Color Selection */}
                        {colors.length > 0 && (
                            <div className="glass rounded-2xl border border-gray-700 p-6 mb-6">
                                <h3 className="text-xl font-bold text-white mb-4">Available Colors</h3>
                                <div className="flex gap-3 flex-wrap">
                                    {colors.map((color) => (
                                        <button
                                            key={color}
                                            onClick={() => setSelectedColor(color)}
                                            className={`relative group ${selectedColor === color
                                                    ? 'ring-2 ring-amber-500 ring-offset-2 ring-offset-gray-900'
                                                    : ''
                                                }`}
                                            title={color}
                                        >
                                            <div
                                                className="w-12 h-12 rounded-full border-2 border-gray-600 hover:border-amber-500 transition-all transform hover:scale-110"
                                                style={{ backgroundColor: colorMap[color] || '#6b7280' }}
                                            />
                                            <span className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                                {color}
                                            </span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Specifications Grid */}
                <div className="mb-12">
                    <h2 className="text-4xl font-black mb-8">
                        <span className="gradient-text">Technical Specifications</span>
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {/* Engine */}
                        <SpecCard
                            icon="⚙️"
                            label="Engine Capacity"
                            value={`${bike.engine_cc}cc`}
                            color="text-blue-400"
                        />

                        {/* Mileage */}
                        {bike.mileage && (
                            <SpecCard
                                icon="🌿"
                                label="Mileage"
                                value={`${bike.mileage} km/l`}
                                color="text-green-400"
                            />
                        )}

                        {/* Top Speed */}
                        {bike.top_speed && (
                            <SpecCard
                                icon="🏁"
                                label="Top Speed"
                                value={`${bike.top_speed} km/h`}
                                color="text-amber-400"
                            />
                        )}

                        {/* Weight */}
                        {bike.weight && (
                            <SpecCard
                                icon="⚖️"
                                label="Weight"
                                value={`${bike.weight} kg`}
                                color="text-purple-400"
                            />
                        )}

                        {/* Fuel Capacity */}
                        {bike.fuel_capacity && (
                            <SpecCard
                                icon="⛽"
                                label="Fuel Tank"
                                value={`${bike.fuel_capacity} liters`}
                                color="text-red-400"
                            />
                        )}

                        {/* Gears */}
                        {bike.gears && (
                            <SpecCard
                                icon="🔧"
                                label="Transmission"
                                value={`${bike.gears} Speed`}
                                color="text-cyan-400"
                            />
                        )}

                        {/* Type */}
                        <SpecCard
                            icon="🏍️"
                            label="Body Type"
                            value={bike.type}
                            color="text-orange-400"
                        />

                        {/* Country */}
                        {bike.country_of_origin && (
                            <SpecCard
                                icon="🌍"
                                label="Origin"
                                value={bike.country_of_origin}
                                color="text-indigo-400"
                            />
                        )}
                    </div>
                </div>

                {/* Test Ride Booking */}
                <div className="max-w-2xl mx-auto">
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
