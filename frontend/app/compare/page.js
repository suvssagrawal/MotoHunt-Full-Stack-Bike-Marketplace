'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

export default function ComparePage() {
    const searchParams = useSearchParams();
    const [bikes, setBikes] = useState([]);
    const [selectedBike1, setSelectedBike1] = useState(searchParams.get('id1') || '');
    const [selectedBike2, setSelectedBike2] = useState(searchParams.get('id2') || '');
    const [bike1Data, setBike1Data] = useState(null);
    const [bike2Data, setBike2Data] = useState(null);
    const [loading, setLoading] = useState(false);

    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

    useEffect(() => {
        fetchAllBikes();
        if (selectedBike1 && selectedBike2) {
            compareBikes();
        }
    }, []);

    const fetchAllBikes = async () => {
        try {
            const res = await fetch(`${API_URL}/api/bikes`);
            const data = await res.json();
            setBikes(data.bikes || []);
        } catch (error) {
            console.error('Failed to fetch bikes:', error);
        }
    };

    const compareBikes = async () => {
        if (!selectedBike1 || !selectedBike2) {
            return;
        }

        setLoading(true);
        try {
            const res = await fetch(
                `${API_URL}/api/bikes/compare/data?id1=${selectedBike1}&id2=${selectedBike2}`
            );
            const data = await res.json();
            setBike1Data(data.bike1);
            setBike2Data(data.bike2);
        } catch (error) {
            console.error('Failed to compare bikes:', error);
        } finally {
            setLoading(false);
        }
    };

    const getBetterValue = (bike1Val, bike2Val, lowerIsBetter = false) => {
        if (!bike1Val || !bike2Val || bike1Val === bike2Val) return 'equal';
        if (lowerIsBetter) {
            return bike1Val < bike2Val ? 'bike1' : 'bike2';
        }
        return bike1Val > bike2Val ? 'bike1' : 'bike2';
    };

    return (
        <div className="min-h-screen pb-20">
            {/* Hero Header */}
            <div className="relative bg-gradient-to-r from-gray-900 via-gray-800 to-amber-900/20 border-b border-amber-500/20 py-16">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?w=1920&q=80')] bg-cover bg-center opacity-10" />
                <div className="relative max-w-7xl mx-auto px-4">
                    <h1 className="text-5xl md:text-6xl font-black mb-4">
                        <span className="gradient-text">⚖️ Compare Motorcycles</span>
                    </h1>
                    <p className="text-gray-300 text-xl">
                        Side-by-side spec comparison with visual indicators
                    </p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-12">
                {/* Bike Selectors */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                    <div className="glass-strong rounded-2xl p-6 border border-gray-700">
                        <label className="block text-gray-300 mb-4 font-bold text-xl flex items-center gap-2">
                            <span>🏍️</span> First Bike
                        </label>
                        <select
                            value={selectedBike1}
                            onChange={(e) => setSelectedBike1(e.target.value)}
                            className="w-full glass border border-gray-600 rounded-xl px-4 py-4 text-white text-lg focus:border-amber-500 focus:outline-none"
                        >
                            <option value="">Choose a bike...</option>
                            {bikes.map((bike) => (
                                <option key={bike.id} value={bike.id}>
                                    {bike.brand_name} {bike.model_name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="glass-strong rounded-2xl p-6 border border-gray-700">
                        <label className="block text-gray-300 mb-4 font-bold text-xl flex items-center gap-2">
                            <span>🏍️</span> Second Bike
                        </label>
                        <select
                            value={selectedBike2}
                            onChange={(e) => setSelectedBike2(e.target.value)}
                            className="w-full glass border border-gray-600 rounded-xl px-4 py-4 text-white text-lg focus:border-amber-500 focus:outline-none"
                        >
                            <option value="">Choose a bike...</option>
                            {bikes.map((bike) => (
                                <option key={bike.id} value={bike.id}>
                                    {bike.brand_name} {bike.model_name}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="text-center mb-12">
                    <button
                        onClick={compareBikes}
                        disabled={!selectedBike1 || !selectedBike2 || loading}
                        className="gradient-primary text-white font-bold px-12 py-4 rounded-xl text-lg shadow-glow-hover disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? '🔄 Comparing...' : '⚖️ Compare Bikes'}
                    </button>
                </div>

                {/* Comparison Table */}
                {bike1Data && bike2Data && (
                    <div className="glass-strong rounded-3xl border border-amber-500/30 overflow-hidden shadow-glow">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gradient-to-r from-gray-900 to-gray-800">
                                    <tr>
                                        <th className="px-6 py-6 text-left text-amber-500 font-bold text-lg">
                                            Specification
                                        </th>
                                        <th className="px-6 py-6 text-center">
                                            <div className="text-white font-black text-xl mb-2">
                                                {bike1Data.brand_name}
                                            </div>
                                            <div className="text-gray-400 text-lg">
                                                {bike1Data.model_name}
                                            </div>
                                        </th>
                                        <th className="px-6 py-6 text-center">
                                            <div className="text-white font-black text-xl mb-2">
                                                {bike2Data.brand_name}
                                            </div>
                                            <div className="text-gray-400 text-lg">
                                                {bike2Data.model_name}
                                            </div>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <CompareRow
                                        label="💰 Price (On-Road)"
                                        value1={`₹${(bike1Data.price_on_road / 100000).toFixed(2)}L`}
                                        value2={`₹${(bike2Data.price_on_road / 100000).toFixed(2)}L`}
                                        better={getBetterValue(bike1Data.price_on_road, bike2Data.price_on_road, true)}
                                    />
                                    <CompareRow
                                        label="⚙️ Engine Capacity"
                                        value1={`${bike1Data.engine_cc}cc`}
                                        value2={`${bike2Data.engine_cc}cc`}
                                        better={getBetterValue(bike1Data.engine_cc, bike2Data.engine_cc)}
                                    />
                                    {bike1Data.mileage && bike2Data.mileage && (
                                        <CompareRow
                                            label="🌿 Mileage"
                                            value1={`${bike1Data.mileage} km/l`}
                                            value2={`${bike2Data.mileage} km/l`}
                                            better={getBetterValue(bike1Data.mileage, bike2Data.mileage)}
                                        />
                                    )}
                                    {bike1Data.top_speed && bike2Data.top_speed && (
                                        <CompareRow
                                            label="🏁 Top Speed"
                                            value1={`${bike1Data.top_speed} km/h`}
                                            value2={`${bike2Data.top_speed} km/h`}
                                            better={getBetterValue(bike1Data.top_speed, bike2Data.top_speed)}
                                        />
                                    )}
                                    {bike1Data.weight && bike2Data.weight && (
                                        <CompareRow
                                            label="⚖️ Weight"
                                            value1={`${bike1Data.weight} kg`}
                                            value2={`${bike2Data.weight} kg`}
                                            better={getBetterValue(bike1Data.weight, bike2Data.weight, true)}
                                        />
                                    )}
                                    {bike1Data.fuel_capacity && bike2Data.fuel_capacity && (
                                        <CompareRow
                                            label="⛽ Fuel Tank"
                                            value1={`${bike1Data.fuel_capacity}L`}
                                            value2={`${bike2Data.fuel_capacity}L`}
                                            better={getBetterValue(bike1Data.fuel_capacity, bike2Data.fuel_capacity)}
                                        />
                                    )}
                                    {bike1Data.gears && bike2Data.gears && (
                                        <CompareRow
                                            label="🔧 Transmission"
                                            value1={`${bike1Data.gears} Speed`}
                                            value2={`${bike2Data.gears} Speed`}
                                            better={getBetterValue(bike1Data.gears, bike2Data.gears)}
                                        />
                                    )}
                                    <CompareRow
                                        label="🏍️ Body Type"
                                        value1={bike1Data.type}
                                        value2={bike2Data.type}
                                        better="equal"
                                    />
                                    <CompareRow
                                        label="🔥 Trending"
                                        value1={bike1Data.is_trending === 1 ? 'Yes' : 'No'}
                                        value2={bike2Data.is_trending === 1 ? 'Yes' : 'No'}
                                        better="equal"
                                    />
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {!bike1Data && !bike2Data && !loading && (
                    <div className="text-center py-20 glass-strong rounded-3xl border border-gray-700">
                        <div className="text-8xl mb-6">⚖️</div>
                        <p className="text-gray-300 text-2xl font-bold mb-4">
                            Ready to Compare
                        </p>
                        <p className="text-gray-400 text-lg">
                            Select two motorcycles to see detailed side-by-side comparison
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}

function CompareRow({ label, value1, value2, better }) {
    const isWinner1 = better === 'bike1';
    const isWinner2 = better === 'bike2';

    return (
        <tr className="border-t border-gray-700/50 hover:bg-white/5 transition-colors">
            <td className="px-6 py-5 text-gray-300 font-semibold">{label}</td>
            <td
                className={`px-6 py-5 text-center font-bold text-lg transition-all ${isWinner1
                        ? 'bg-green-500/20 text-green-400 border-l-4 border-green-500'
                        : 'text-white'
                    }`}
            >
                <div className="flex items-center justify-center gap-2">
                    {isWinner1 && <span className="text-2xl">✓</span>}
                    <span>{value1}</span>
                </div>
            </td>
            <td
                className={`px-6 py-5 text-center font-bold text-lg transition-all ${isWinner2
                        ? 'bg-green-500/20 text-green-400 border-l-4 border-green-500'
                        : 'text-white'
                    }`}
            >
                <div className="flex items-center justify-center gap-2">
                    {isWinner2 && <span className="text-2xl">✓</span>}
                    <span>{value2}</span>
                </div>
            </td>
        </tr>
    );
}
