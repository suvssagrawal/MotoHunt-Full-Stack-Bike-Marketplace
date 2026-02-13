'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import BikeSelectorModal from '@/components/BikeSelectorModal';
import ShareButton from '@/components/ShareButton';

export default function ComparePage() {
    const searchParams = useSearchParams();
    const [bikes, setBikes] = useState([]);
    const [selectedBike1, setSelectedBike1] = useState(searchParams.get('id1') || '');
    const [selectedBike2, setSelectedBike2] = useState(searchParams.get('id2') || '');
    const [bike1Data, setBike1Data] = useState(null);
    const [bike2Data, setBike2Data] = useState(null);
    const [loading, setLoading] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [activeSelector, setActiveSelector] = useState(null); // 'bike1' or 'bike2'
    const [highlightDiff, setHighlightDiff] = useState(false);

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

    // Effect to trigger comparison when selection changes
    useEffect(() => {
        if (selectedBike1 && selectedBike2) {
            compareBikes();
        }
    }, [selectedBike1, selectedBike2]);

    const compareBikes = async () => {
        if (!selectedBike1 || !selectedBike2) return;

        setLoading(true);
        try {
            // Fix: pass IDs correctly
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

    const openSelector = (selector) => {
        setActiveSelector(selector);
        setModalOpen(true);
    };

    const handleSelection = (id) => {
        if (activeSelector === 'bike1') setSelectedBike1(id);
        if (activeSelector === 'bike2') setSelectedBike2(id);
    };

    const getBetterValue = (bike1Val, bike2Val, lowerIsBetter = false) => {
        if (!bike1Val || !bike2Val || bike1Val === bike2Val) return 'equal';
        if (lowerIsBetter) {
            return bike1Val < bike2Val ? 'bike1' : 'bike2';
        }
        return bike1Val > bike2Val ? 'bike1' : 'bike2';
    };

    // Find bike objects for selector display
    const bike1Obj = bikes.find(b => b.id.toString() === selectedBike1.toString());
    const bike2Obj = bikes.find(b => b.id.toString() === selectedBike2.toString());

    return (
        <div className="min-h-screen pb-20">
            {/* Modal */}
            <BikeSelectorModal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                onSelect={handleSelection}
                bikes={bikes}
                currentSelection={activeSelector === 'bike1' ? selectedBike1 : selectedBike2}
                excludeId={activeSelector === 'bike1' ? selectedBike2 : selectedBike1}
            />

            {/* Hero Header */}
            <div className="relative bg-gradient-to-r from-gray-900 via-gray-800 to-amber-900/20 border-b border-amber-500/20 py-16">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?w=1920&q=80')] bg-cover bg-center opacity-10" />
                <div className="relative max-w-7xl mx-auto px-4 text-center">
                    <h1 className="text-5xl md:text-6xl font-black mb-4">
                        <span className="gradient-text">Compare & Choose</span>
                    </h1>
                    <p className="text-gray-300 text-xl max-w-2xl mx-auto">
                        Pit top contenders against each other. Analyze specs, features, and pricing side-by-side.
                    </p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-8">
                {/* Bike Selectors */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12 relative">
                    {/* VS Badge */}
                    <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-amber-500 rounded-full flex items-center justify-center font-black text-white text-xl shadow-glow z-10 border-4 border-gray-900 hidden md:flex">
                        VS
                    </div>

                    {/* Selector 1 */}
                    <div className="glass-strong rounded-3xl p-8 border border-gray-700 flex flex-col items-center text-center hover:border-amber-500/30 transition-colors">
                        <div className="w-full aspect-[16/10] bg-black/40 rounded-2xl mb-6 overflow-hidden relative group">
                            {bike1Obj ? (
                                <img
                                    src={bike1Obj.image_url}
                                    alt={bike1Obj.model_name}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-6xl">
                                    🏍️
                                </div>
                            )}

                            <button
                                onClick={() => openSelector('bike1')}
                                className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                <span className="bg-amber-500 text-white font-bold px-6 py-3 rounded-full shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-transform">
                                    Change Bike
                                </span>
                            </button>
                        </div>

                        <h3 className="text-2xl font-black text-white mb-1">
                            {bike1Obj ? bike1Obj.model_name : 'Select Bike 1'}
                        </h3>
                        {bike1Obj && <p className="text-gray-400 mb-4">{bike1Obj.brand_name}</p>}

                        {!bike1Obj && (
                            <button
                                onClick={() => openSelector('bike1')}
                                className="gradient-primary text-white font-bold px-8 py-3 rounded-xl shadow-glow-hover"
                            >
                                Select First Bike
                            </button>
                        )}
                    </div>

                    {/* Selector 2 */}
                    <div className="glass-strong rounded-3xl p-8 border border-gray-700 flex flex-col items-center text-center hover:border-amber-500/30 transition-colors">
                        <div className="w-full aspect-[16/10] bg-black/40 rounded-2xl mb-6 overflow-hidden relative group">
                            {bike2Obj ? (
                                <img
                                    src={bike2Obj.image_url}
                                    alt={bike2Obj.model_name}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-6xl">
                                    🏍️
                                </div>
                            )}
                            <button
                                onClick={() => openSelector('bike2')}
                                className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                <span className="bg-amber-500 text-white font-bold px-6 py-3 rounded-full shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-transform">
                                    Change Bike
                                </span>
                            </button>
                        </div>

                        <h3 className="text-2xl font-black text-white mb-1">
                            {bike2Obj ? bike2Obj.model_name : 'Select Bike 2'}
                        </h3>
                        {bike2Obj && <p className="text-gray-400 mb-4">{bike2Obj.brand_name}</p>}

                        {!bike2Obj && (
                            <button
                                onClick={() => openSelector('bike2')}
                                className="gradient-primary text-white font-bold px-8 py-3 rounded-xl shadow-glow-hover"
                            >
                                Select Second Bike
                            </button>
                        )}
                    </div>
                </div>

                {/* Controls */}
                {bike1Data && bike2Data && (
                    <div className="flex flex-col md:flex-row justify-between items-center mb-8 px-4 gap-4">
                        <h2 className="text-2xl font-bold text-white">Spec Comparison</h2>

                        <div className="flex items-center gap-4">
                            {/* Highlight Toggle */}
                            <div className="flex items-center gap-2 bg-gray-800/50 px-4 py-2 rounded-full border border-gray-700">
                                <span className={`text-sm font-medium ${highlightDiff ? 'text-amber-500' : 'text-gray-400'}`}>
                                    Highlight Differences
                                </span>
                                <button
                                    onClick={() => setHighlightDiff(!highlightDiff)}
                                    className={`w-10 h-6 rounded-full p-1 transition-colors duration-300 ${highlightDiff ? 'bg-amber-500' : 'bg-gray-600'}`}
                                >
                                    <div className={`w-4 h-4 rounded-full bg-white shadow-md transform transition-transform duration-300 ${highlightDiff ? 'translate-x-4' : 'translate-x-0'}`} />
                                </button>
                            </div>

                            {/* Share Button */}
                            <ShareButton
                                title={`Compare ${bike1Data.model_name} vs ${bike2Data.model_name}`}
                                text={`Check out this comparison: ${bike1Data.model_name} vs ${bike2Data.model_name} on MotoHunt!`}
                            />

                            {/* Reset Button */}
                            <button
                                onClick={() => {
                                    setSelectedBike1('');
                                    setSelectedBike2('');
                                    setBike1Data(null);
                                    setBike2Data(null);
                                }}
                                className="p-2 rounded-full hover:bg-white/10 text-gray-400 hover:text-red-400 transition-colors"
                                title="Reset Comparison"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                            </button>
                        </div>
                    </div>
                )}

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
                                        highlightDiff={highlightDiff}
                                    />
                                    <CompareRow
                                        label="⚙️ Engine Capacity"
                                        value1={`${bike1Data.engine_cc}cc`}
                                        value2={`${bike2Data.engine_cc}cc`}
                                        better={getBetterValue(bike1Data.engine_cc, bike2Data.engine_cc)}
                                        highlightDiff={highlightDiff}
                                    />
                                    {bike1Data.mileage && bike2Data.mileage && (
                                        <CompareRow
                                            label="🌿 Mileage"
                                            value1={`${bike1Data.mileage} km/l`}
                                            value2={`${bike2Data.mileage} km/l`}
                                            better={getBetterValue(bike1Data.mileage, bike2Data.mileage)}
                                            highlightDiff={highlightDiff}
                                        />
                                    )}
                                    {bike1Data.top_speed && bike2Data.top_speed && (
                                        <CompareRow
                                            label="🏁 Top Speed"
                                            value1={`${bike1Data.top_speed} km/h`}
                                            value2={`${bike2Data.top_speed} km/h`}
                                            better={getBetterValue(bike1Data.top_speed, bike2Data.top_speed)}
                                            highlightDiff={highlightDiff}
                                        />
                                    )}
                                    {bike1Data.weight && bike2Data.weight && (
                                        <CompareRow
                                            label="⚖️ Weight"
                                            value1={`${bike1Data.weight} kg`}
                                            value2={`${bike2Data.weight} kg`}
                                            better={getBetterValue(bike1Data.weight, bike2Data.weight, true)}
                                            highlightDiff={highlightDiff}
                                        />
                                    )}
                                    {bike1Data.fuel_capacity && bike2Data.fuel_capacity && (
                                        <CompareRow
                                            label="⛽ Fuel Tank"
                                            value1={`${bike1Data.fuel_capacity}L`}
                                            value2={`${bike2Data.fuel_capacity}L`}
                                            better={getBetterValue(bike1Data.fuel_capacity, bike2Data.fuel_capacity)}
                                            highlightDiff={highlightDiff}
                                        />
                                    )}
                                    {bike1Data.gears && bike2Data.gears && (
                                        <CompareRow
                                            label="🔧 Transmission"
                                            value1={`${bike1Data.gears} Speed`}
                                            value2={`${bike2Data.gears} Speed`}
                                            better={getBetterValue(bike1Data.gears, bike2Data.gears)}
                                            highlightDiff={highlightDiff}
                                        />
                                    )}
                                    <CompareRow
                                        label="🏍️ Body Type"
                                        value1={bike1Data.type}
                                        value2={bike2Data.type}
                                        better="equal"
                                        highlightDiff={highlightDiff}
                                    />
                                    <CompareRow
                                        label="🔥 Trending"
                                        value1={bike1Data.is_trending === 1 ? 'Yes' : 'No'}
                                        value2={bike2Data.is_trending === 1 ? 'Yes' : 'No'}
                                        better="equal"
                                        highlightDiff={highlightDiff}
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

function CompareRow({ label, value1, value2, better, highlightDiff }) {
    const isWinner1 = better === 'bike1';
    const isWinner2 = better === 'bike2';
    const isDifferent = better !== 'equal';

    // If highlight mode is on and values are same, dim the row
    const rowOpacity = highlightDiff && !isDifferent ? 'opacity-30 blur-[1px]' : 'opacity-100';

    return (
        <tr className={`border-t border-gray-700/50 hover:bg-white/5 transition-all duration-500 ${rowOpacity}`}>
            <td className="px-6 py-5 text-gray-300 font-semibold">{label}</td>
            <td
                className={`px-6 py-5 text-center font-bold text-lg transition-all ${isWinner1
                    ? 'bg-green-500/20 text-green-400 border-l-4 border-green-500'
                    : highlightDiff && isDifferent ? 'bg-red-500/10 text-gray-400' : 'text-white'
                    }`}
            >
                <div className="flex items-center justify-center gap-2">
                    {isWinner1 && <span className="text-2xl animate-pulse-slow">✓</span>}
                    <span>{value1}</span>
                </div>
            </td>
            <td
                className={`px-6 py-5 text-center font-bold text-lg transition-all ${isWinner2
                    ? 'bg-green-500/20 text-green-400 border-l-4 border-green-500'
                    : highlightDiff && isDifferent ? 'bg-red-500/10 text-gray-400' : 'text-white'
                    }`}
            >
                <div className="flex items-center justify-center gap-2">
                    {isWinner2 && <span className="text-2xl animate-pulse-slow">✓</span>}
                    <span>{value2}</span>
                </div>
            </td>
        </tr>
    );
}
