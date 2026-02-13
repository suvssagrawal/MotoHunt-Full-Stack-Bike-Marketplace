'use client';
import { useState, useEffect } from 'react';

export default function BikeSelectorModal({ isOpen, onClose, onSelect, bikes, currentSelection, excludeId }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredBikes, setFilteredBikes] = useState([]);

    useEffect(() => {
        if (bikes) {
            setFilteredBikes(
                bikes.filter(bike =>
                    bike.id !== excludeId &&
                    (bike.model_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        bike.brand_name.toLowerCase().includes(searchTerm.toLowerCase()))
                )
            );
        }
    }, [searchTerm, bikes, excludeId]);

    // Reset search when opening
    useEffect(() => {
        if (isOpen) setSearchTerm('');
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
            <div className="bg-gray-900 rounded-3xl w-full max-w-2xl border border-white/10 shadow-2xl overflow-hidden flex flex-col max-h-[80vh] animate-scale-up">

                {/* Header */}
                <div className="p-6 border-b border-white/10 flex justify-between items-center bg-gray-800/50">
                    <h3 className="text-2xl font-bold text-white">Select a Motorcycle</h3>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Search */}
                <div className="p-6 pb-2">
                    <div className="relative">
                        <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">🔍</span>
                        <input
                            type="text"
                            placeholder="Search by model or brand..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-black/30 border border-gray-700 rounded-xl py-4 pl-12 pr-4 text-white focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500 transition-all"
                            autoFocus
                        />
                    </div>
                </div>

                {/* List */}
                <div className="flex-1 overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {filteredBikes.map(bike => (
                            <button
                                key={bike.id}
                                onClick={() => {
                                    onSelect(bike.id);
                                    onClose();
                                }}
                                className={`flex items-center gap-4 p-3 rounded-xl border transition-all text-left group ${currentSelection === bike.id.toString()
                                        ? 'bg-amber-500/20 border-amber-500'
                                        : 'bg-white/5 border-transparent hover:bg-white/10 hover:border-gray-600'
                                    }`}
                            >
                                <div className="w-16 h-16 rounded-lg overflow-hidden bg-black/50 flex-shrink-0">
                                    {bike.image_url ? (
                                        <img
                                            src={bike.image_url}
                                            alt={bike.model_name}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-xl">🏍️</div>
                                    )}
                                </div>
                                <div>
                                    <div className="font-bold text-white group-hover:text-amber-400 transition-colors">
                                        {bike.model_name}
                                    </div>
                                    <div className="text-sm text-gray-400">
                                        {bike.brand_name}
                                    </div>
                                    <div className="text-xs font-medium text-amber-500 mt-1">
                                        ₹{(bike.price_on_road / 100000).toFixed(2)}L
                                    </div>
                                </div>
                            </button>
                        ))}

                        {filteredBikes.length === 0 && (
                            <div className="col-span-full text-center py-8 text-gray-500">
                                No bikes found matching "{searchTerm}"
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
