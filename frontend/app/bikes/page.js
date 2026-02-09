'use client';

import { useEffect, useState } from 'react';
import BikeCard from '@/components/BikeCard';

export default function BikesPage() {
    const [bikes, setBikes] = useState([]);
    const [brands, setBrands] = useState([]);
    const [loading, setLoading] = useState(true);
    const [sortBy, setSortBy] = useState('');

    // Filter states
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');
    const [selectedBrand, setSelectedBrand] = useState('');
    const [selectedType, setSelectedType] = useState('');
    const [ccRange, setCcRange] = useState('');

    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

    useEffect(() => {
        fetchBrands();
        fetchBikes();
    }, []);

    const fetchBrands = async () => {
        try {
            const res = await fetch(`${API_URL}/api/brands`);
            const data = await res.json();
            setBrands(data.brands || []);
        } catch (error) {
            console.error('Failed to fetch brands:', error);
        }
    };

    const fetchBikes = async () => {
        try {
            setLoading(true);
            let query = `${API_URL}/api/bikes?`;

            if (minPrice) query += `minPrice=${minPrice}&`;
            if (maxPrice) query += `maxPrice=${maxPrice}&`;
            if (selectedBrand) query += `brand=${selectedBrand}&`;
            if (selectedType) query += `type=${selectedType}&`;

            if (ccRange) {
                const [min, max] = ccRange.split('-');
                if (min) query += `minCC=${min}&`;
                if (max && max !== '+') query += `maxCC=${max}&`;
            }

            const res = await fetch(query);
            const data = await res.json();
            let fetchedBikes = data.bikes || [];

            // Client-side sorting
            if (sortBy === 'price-low') {
                fetchedBikes.sort((a, b) => a.price_on_road - b.price_on_road);
            } else if (sortBy === 'price-high') {
                fetchedBikes.sort((a, b) => b.price_on_road - a.price_on_road);
            } else if (sortBy === 'mileage') {
                fetchedBikes.sort((a, b) => (b.mileage || 0) - (a.mileage || 0));
            } else if (sortBy === 'speed') {
                fetchedBikes.sort((a, b) => (b.top_speed || 0) - (a.top_speed || 0));
            }

            setBikes(fetchedBikes);
        } catch (error) {
            console.error('Failed to fetch bikes:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleFilterChange = () => {
        fetchBikes();
    };

    const resetFilters = () => {
        setMinPrice('');
        setMaxPrice('');
        setSelectedBrand('');
        setSelectedType('');
        setCcRange('');
        setSortBy('');
        fetchBikes();
    };

    return (
        <div className="min-h-screen">
            {/* Hero Header */}
            <div className="relative bg-gradient-to-r from-gray-900 via-gray-800 to-amber-900/20 border-b border-amber-500/20 py-16">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?w=1920&q=80')] bg-cover bg-center opacity-10" />
                <div className="relative max-w-7xl mx-auto px-4">
                    <h1 className="text-5xl md:text-6xl font-black mb-4">
                        <span className="gradient-text">Browse Motorcycles</span>
                    </h1>
                    <p className="text-gray-300 text-xl">
                        {bikes.length > 0 ? `${bikes.length} premium bikes` : 'Loading bikes'}  available
                    </p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Glassmorphic Filter Panel */}
                    <div className="lg:col-span-1">
                        <div className="glass-strong rounded-2xl border border-gray-700 p-6 sticky top-24">
                            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                                <span>🔍</span>
                                Filters
                            </h2>

                            {/* Price Range */}
                            <div className="mb-6">
                                <label className="block text-gray-300 mb-3 font-semibold">
                                    Price Range (₹)
                                </label>
                                <div className="grid grid-cols-2 gap-3">
                                    <input
                                        type="number"
                                        placeholder="Min"
                                        value={minPrice}
                                        onChange={(e) => setMinPrice(e.target.value)}
                                        className="glass border border-gray-600 rounded-xl px-4 py-3 text-white text-sm focus:border-amber-500 focus:outline-none"
                                    />
                                    <input
                                        type="number"
                                        placeholder="Max"
                                        value={maxPrice}
                                        onChange={(e) => setMaxPrice(e.target.value)}
                                        className="glass border border-gray-600 rounded-xl px-4 py-3 text-white text-sm focus:border-amber-500 focus:outline-none"
                                    />
                                </div>
                            </div>

                            {/* Engine CC */}
                            <div className="mb-6">
                                <label className="block text-gray-300 mb-3 font-semibold">
                                    Engine Capacity
                                </label>
                                <select
                                    value={ccRange}
                                    onChange={(e) => setCcRange(e.target.value)}
                                    className="w-full glass border border-gray-600 rounded-xl px-4 py-3 text-white focus:border-amber-500 focus:outline-none"
                                >
                                    <option value="">All CC</option>
                                    <option value="0-200">0-200cc</option>
                                    <option value="200-400">200-400cc</option>
                                    <option value="400-">400cc+</option>
                                </select>
                            </div>

                            {/* Brand */}
                            <div className="mb-6">
                                <label className="block text-gray-300 mb-3 font-semibold">
                                    Brand
                                </label>
                                <select
                                    value={selectedBrand}
                                    onChange={(e) => setSelectedBrand(e.target.value)}
                                    className="w-full glass border border-gray-600 rounded-xl px-4 py-3 text-white focus:border-amber-500 focus:outline-none"
                                >
                                    <option value="">All Brands</option>
                                    {brands.map((brand) => (
                                        <option key={brand.id} value={brand.name}>
                                            {brand.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Type */}
                            <div className="mb-6">
                                <label className="block text-gray-300 mb-3 font-semibold">
                                    Body Type
                                </label>
                                <select
                                    value={selectedType}
                                    onChange={(e) => setSelectedType(e.target.value)}
                                    className="w-full glass border border-gray-600 rounded-xl px-4 py-3 text-white focus:border-amber-500 focus:outline-none"
                                >
                                    <option value="">All Types</option>
                                    <option value="Cruiser">Cruiser</option>
                                    <option value="Sports">Sports</option>
                                    <option value="Naked">Naked</option>
                                    <option value="Tourer">Tourer</option>
                                    <option value="Retro">Retro</option>
                                    <option value="Roadster">Roadster</option>
                                    <option value="Scrambler">Scrambler</option>
                                </select>
                            </div>

                            <div className="space-y-3">
                                <button
                                    onClick={handleFilterChange}
                                    className="w-full gradient-primary text-white font-bold py-3 rounded-xl shadow-glow-hover"
                                >
                                    Apply Filters
                                </button>
                                <button
                                    onClick={resetFilters}
                                    className="w-full glass border border-gray-600 text-white font-semibold py-3 rounded-xl hover:border-amber-500"
                                >
                                    Reset All
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Bikes Grid */}
                    <div className="lg:col-span-3">
                        {/* Sort Bar */}
                        <div className="flex items-center justify-between mb-8 glass rounded-xl p-4 border border-gray-700">
                            <p className="text-gray-300">
                                <span className="font-bold text-white">{bikes.length}</span> Results
                            </p>
                            <div className="flex items-center gap-3">
                                <label className="text-gray-400 text-sm">Sort by:</label>
                                <select
                                    value={sortBy}
                                    onChange={(e) => {
                                        setSortBy(e.target.value);
                                        setTimeout(fetchBikes, 0);
                                    }}
                                    className="glass border border-gray-600 rounded-lg px-4 py-2 text-white text-sm focus:border-amber-500 focus:outline-none"
                                >
                                    <option value="">Default</option>
                                    <option value="price-low">Price: Low to High</option>
                                    <option value="price-high">Price: High to Low</option>
                                    <option value="mileage">Best Mileage</option>
                                    <option value="speed">Top Speed</option>
                                </select>
                            </div>
                        </div>

                        {loading ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {[1, 2, 3, 4, 5, 6].map((i) => (
                                    <div key={i} className="h-96 glass rounded-2xl shimmer border border-gray-700" />
                                ))}
                            </div>
                        ) : bikes.length === 0 ? (
                            <div className="text-center py-20 glass-strong rounded-3xl border border-gray-700">
                                <div className="text-8xl mb-6">🔍</div>
                                <p className="text-gray-300 text-2xl font-bold mb-4">No bikes found</p>
                                <p className="text-gray-400 mb-6">Try adjusting your filters</p>
                                <button
                                    onClick={resetFilters}
                                    className="gradient-primary text-white font-bold px-8 py-3 rounded-xl shadow-glow-hover"
                                >
                                    Clear All Filters
                                </button>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {bikes.map((bike) => (
                                    <BikeCard key={bike.id} bike={bike} />
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
