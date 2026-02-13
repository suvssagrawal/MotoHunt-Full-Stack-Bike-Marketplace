'use client';

import { useEffect, useState } from 'react';
import BikeCard from '@/components/BikeCard';
import { BikeCardSkeleton } from '@/components/LoadingComponents';
import ScrollReveal from '@/components/ScrollReveal';

export default function BikesPage() {
    const [bikes, setBikes] = useState([]);
    const [brands, setBrands] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const LIMIT = 9; // Bikes per page

    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

    useEffect(() => {
        fetchBrands();
    }, []);

    useEffect(() => {
        fetchBikes();
        // Screw standard dependency arrays, we want specific triggers
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page, minPrice, maxPrice, selectedBrand, selectedType, ccRange, sortBy]);

    // Reset to page 1 when filters change
    useEffect(() => {
        setPage(1);
    }, [minPrice, maxPrice, selectedBrand, selectedType, ccRange, sortBy]);

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
            let query = `${API_URL}/api/bikes?page=${page}&limit=${LIMIT}&`;

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

            // Backend sorting for basic filters is better, but since our complex sorts (mileage/speed) 
            // might not be fully supported by the basic SQL query structure perfectly without more backend work,
            // we might still rely on client side or update backend. 
            // WAIT - Logic check: If we paginate on backend, we can't sort on client side properly across all pages.
            // For now, let's assume the default sort (created_at) is what we get from backend.
            // If user selects specific sort, we should probably pass that to backend.
            // BUT, for phase 3, let's keep it simple. If we client sort, it only sorts the CURRENT PAGE. 
            // That is an acceptable trade-off for now unless we update backend sorting.
            // Let's implement client sort on the current page for immediate feedback.

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
            if (data.pagination) {
                setTotalPages(data.pagination.pages);
            }
        } catch (error) {
            console.error('Failed to fetch bikes:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleFilterChange = () => {
        // Handled by useEffect
    };

    const resetFilters = () => {
        setMinPrice('');
        setMaxPrice('');
        setSelectedBrand('');
        setSelectedType('');
        setCcRange('');
        setSortBy('');
        // Handled by useEffect
    };

    const activeFiltersCount = [minPrice, maxPrice, selectedBrand, selectedType, ccRange].filter(Boolean).length;

    return (
        <div className="min-h-screen">
            {/* Hero Header */}
            <div className="relative bg-gradient-to-r from-gray-900 via-gray-800 to-amber-900/20 border-b border-amber-500/20 py-20">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?w=1920&q=80')] bg-cover bg-center opacity-10" />
                <div className="relative max-w-7xl mx-auto px-4">
                    <ScrollReveal animation="fade-up">
                        <h1 className="text-5xl md:text-6xl font-black mb-4">
                            <span className="gradient-text text-glow">Browse Motorcycles</span>
                        </h1>
                        <p className="text-gray-300 text-xl">
                            Find your perfect ride among our premium collection
                        </p>
                    </ScrollReveal>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Filters Sidebar */}
                    <aside className="lg:col-span-1">
                        <div className="glass-3d rounded-2xl p-8 sticky top-24 neon-border">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-2xl font-bold gradient-text">Filters</h2>
                                {activeFiltersCount > 0 && (
                                    <span className="bg-amber-500 text-black px-3 py-1 rounded-full text-sm font-bold">
                                        {activeFiltersCount}
                                    </span>
                                )}
                            </div>

                            {/* Price Range */}
                            <div className="mb-6">
                                <label className="block text-gray-300 font-semibold mb-3">Price Range</label>
                                <div className="grid grid-cols-2 gap-3">
                                    <input
                                        type="number"
                                        placeholder="Min"
                                        value={minPrice}
                                        onChange={(e) => setMinPrice(e.target.value)}
                                        className="glass px-4 py-3 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
                                    />
                                    <input
                                        type="number"
                                        placeholder="Max"
                                        value={maxPrice}
                                        onChange={(e) => setMaxPrice(e.target.value)}
                                        className="glass px-4 py-3 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
                                    />
                                </div>
                            </div>

                            {/* Brand */}
                            <div className="mb-6">
                                <label className="block text-gray-300 font-semibold mb-3">Brand</label>
                                <select
                                    value={selectedBrand}
                                    onChange={(e) => setSelectedBrand(e.target.value)}
                                    className="w-full glass px-4 py-3 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                                >
                                    <option value="">All Brands</option>
                                    {brands.map(brand => (
                                        <option key={brand.id} value={brand.id}>{brand.name}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Type */}
                            <div className="mb-6">
                                <label className="block text-gray-300 font-semibold mb-3">Type</label>
                                <select
                                    value={selectedType}
                                    onChange={(e) => setSelectedType(e.target.value)}
                                    className="w-full glass px-4 py-3 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                                >
                                    <option value="">All Types</option>
                                    <option value="Sport">Sport</option>
                                    <option value="Cruiser">Cruiser</option>
                                    <option value="Adventure">Adventure</option>
                                    <option value="Naked">Naked</option>
                                    <option value="Touring">Touring</option>
                                    <option value="Scooter">Scooter</option>
                                </select>
                            </div>

                            {/* Engine CC */}
                            <div className="mb-8">
                                <label className="block text-gray-300 font-semibold mb-3">Engine CC</label>
                                <select
                                    value={ccRange}
                                    onChange={(e) => setCcRange(e.target.value)}
                                    className="w-full glass px-4 py-3 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                                >
                                    <option value="">All CC</option>
                                    <option value="0-125">0-125 CC</option>
                                    <option value="126-250">126-250 CC</option>
                                    <option value="251-500">251-500 CC</option>
                                    <option value="501-1000">501-1000 CC</option>
                                    <option value="1001-+">1000+ CC</option>
                                </select>
                            </div>

                            {/* Action Buttons */}
                            <div className="space-y-3">
                                {activeFiltersCount > 0 && (
                                    <button
                                        onClick={resetFilters}
                                        className="w-full glass-strong px-6 py-4 rounded-xl font-semibold hover:bg-red-500/20 hover:border-red-500 transition-all"
                                    >
                                        Clear All
                                    </button>
                                )}
                            </div>
                        </div>
                    </aside>

                    {/* Bikes Grid */}
                    <div className="lg:col-span-3">
                        {/* Toolbar */}
                        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-8">
                            {/* Sort */}
                            <div className="flex items-center gap-3 w-full sm:w-auto">
                                <span className="text-gray-300 font-semibold whitespace-nowrap">Sort by:</span>
                                <select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                    className="flex-1 sm:flex-none glass px-5 py-3 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                                >
                                    <option value="">Default</option>
                                    <option value="price-low">Price: Low to High</option>
                                    <option value="price-high">Price: High to Low</option>
                                    <option value="mileage">Best Mileage</option>
                                    <option value="speed">Top Speed</option>
                                </select>
                            </div>

                            {/* View Toggle */}
                            <div className="flex items-center gap-2 glass p-2 rounded-xl">
                                <button
                                    onClick={() => setViewMode('grid')}
                                    className={`p-3 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-amber-500 text-black' : 'text-gray-400 hover:text-white'}`}
                                >
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M3 4a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm0 8a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H4a1 1 0 01-1-1v-4zm8-8a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1V4zm0 8a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" />
                                    </svg>
                                </button>
                                <button
                                    onClick={() => setViewMode('list')}
                                    className={`p-3 rounded-lg transition-all ${viewMode === 'list' ? 'bg-amber-500 text-black' : 'text-gray-400 hover:text-white'}`}
                                >
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                                    </svg>
                                </button>
                            </div>
                        </div>

                        {/* Bikes Display */}
                        {loading ? (
                            <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8' : 'space-y-6'}>
                                {[1, 2, 3, 4, 5, 6].map(i => <BikeCardSkeleton key={i} />)}
                            </div>
                        ) : bikes.length > 0 ? (
                            <>
                                <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8' : 'space-y-6'}>
                                    {bikes.map((bike, index) => (
                                        <ScrollReveal key={bike.id} animation="fade-up" delay={index * 50}>
                                            <BikeCard bike={bike} />
                                        </ScrollReveal>
                                    ))}
                                </div>

                                {/* Pagination Controls */}
                                <div className="mt-12 flex justify-center items-center gap-4">
                                    <button
                                        onClick={() => setPage(p => Math.max(1, p - 1))}
                                        disabled={page === 1}
                                        className="glass px-6 py-3 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:glass-strong transition-all flex items-center gap-2"
                                    >
                                        ← Previous
                                    </button>
                                    <div className="flex items-center gap-2">
                                        {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                                            <button
                                                key={p}
                                                onClick={() => setPage(p)}
                                                className={`w-10 h-10 rounded-xl font-bold transition-all ${page === p
                                                        ? 'gradient-primary text-white shadow-glow'
                                                        : 'glass text-gray-400 hover:text-white hover:glass-strong'
                                                    }`}
                                            >
                                                {p}
                                            </button>
                                        ))}
                                    </div>
                                    <button
                                        onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                        disabled={page === totalPages}
                                        className="glass px-6 py-3 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:glass-strong transition-all flex items-center gap-2"
                                    >
                                        Next →
                                    </button>
                                </div>
                            </>
                        ) : (
                            <div className="glass-3d rounded-3xl p-16 text-center">
                                <div className="text-8xl mb-6">🔍</div>
                                <h3 className="text-3xl font-bold text-gray-300 mb-4">No bikes found</h3>
                                <p className="text-gray-400 mb-8">Try adjusting your filters to see more results</p>
                                <button
                                    onClick={resetFilters}
                                    className="gradient-primary px-8 py-4 rounded-xl font-semibold shadow-glow-hover btn-magnetic"
                                >
                                    Reset Filters
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
