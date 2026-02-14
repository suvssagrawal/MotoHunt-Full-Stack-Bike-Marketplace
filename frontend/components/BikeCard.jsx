import Link from 'next/link';
import { useWishlist } from '@/context/WishlistContext';
import { useState } from 'react';

export default function BikeCard({ bike }) {
    const { toggleWishlist, isInWishlist } = useWishlist();
    const [imageError, setImageError] = useState(false);
    // Parse color options
    const colors = bike.color_options ? bike.color_options.split(',') : [];

    // Color mapping for display
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
        <Link href={`/bikes/${bike.id}`}>
            <div className="group glass-3d rounded-2xl overflow-hidden border border-gray-700/50 hover:border-amber-500/70 card-hover shadow-glow-hover neon-border relative">
                {/* Image Section */}
                <div className="relative h-56 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 overflow-hidden">
                    {bike.image_url && !imageError ? (
                        <img
                            src={bike.image_url}
                            alt={bike.model_name}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                            onError={() => setImageError(true)}
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-7xl">
                            🏍️
                        </div>
                    )}

                    {/* Trending Badge */}
                    {bike.is_trending === 1 && (
                        <div className="absolute top-3 right-3 gradient-primary text-white px-4 py-2 rounded-full text-xs font-black shadow-glow animate-pulse-slow border-animate text-glow">
                            🔥 TRENDING
                        </div>
                    )}

                    {/* Wishlist Button */}
                    <button
                        onClick={(e) => {
                            e.preventDefault();
                            toggleWishlist(bike);
                        }}
                        className={`absolute top-3 left-3 p-2 rounded-full glass transition-all ${isInWishlist(bike.id)
                            ? 'bg-red-500/20 text-red-500 hover:bg-red-500/40'
                            : 'text-gray-300 hover:text-white hover:bg-white/10'
                            }`}
                    >
                        <svg
                            className={`w-5 h-5 ${isInWishlist(bike.id) ? 'fill-current' : 'fill-none'}`}
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            strokeWidth="2"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                    </button>

                    {/* Quick Specs Overlay */}
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-3">
                        <div className="flex gap-2 flex-wrap">
                            {bike.mileage && (
                                <span className="glass text-xs text-white px-2 py-1 rounded-lg font-medium flex items-center gap-1">
                                    <span className="text-green-400">⚡</span>
                                    {bike.mileage} km/l
                                </span>
                            )}
                            {bike.top_speed && (
                                <span className="glass text-xs text-white px-2 py-1 rounded-lg font-medium flex items-center gap-1">
                                    <span className="text-amber-400">🏁</span>
                                    {bike.top_speed} km/h
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                {/* Content Section */}
                <div className="p-6">
                    {/* Title */}
                    <h3 className="text-xl font-black text-white mb-2 group-hover:text-amber-400 transition-colors line-clamp-1 text-glow">
                        {bike.model_name}
                    </h3>
                    <p className="text-gray-400 text-sm mb-4">{bike.brand_name}</p>

                    {/* Price & CC */}
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <p className="text-xs text-gray-500 mb-1">Price</p>
                            <p className="text-3xl font-black gradient-text text-glow">
                                ₹{(bike.price_on_road / 100000).toFixed(2)}L
                            </p>
                        </div>
                        <div className="text-right">
                            <p className="text-xs text-gray-500 mb-1">Engine</p>
                            <p className="text-white font-bold text-lg">{bike.engine_cc}cc</p>
                        </div>
                    </div>

                    {/* Color Options & Type */}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-700/50">
                        {/* Colors */}
                        {colors.length > 0 && (
                            <div className="flex items-center gap-1.5">
                                {colors.slice(0, 4).map((color, index) => (
                                    <div
                                        key={index}
                                        className="w-5 h-5 rounded-full border-2 border-gray-600 hover:border-amber-500 transition-colors"
                                        style={{ backgroundColor: colorMap[color.trim()] || '#6b7280' }}
                                        title={color.trim()}
                                    />
                                ))}
                                {colors.length > 4 && (
                                    <span className="text-xs text-gray-400">+{colors.length - 4}</span>
                                )}
                            </div>
                        )}

                        {/* Type Badge */}
                        <span className="inline-flex items-center gap-1 glass text-gray-300 px-3 py-1.5 rounded-lg text-xs font-medium border border-gray-600">
                            {bike.gears && <span className="text-amber-400">⚙️</span>}
                            {bike.type}
                        </span>
                    </div>
                </div>

                {/* Hover Glow Effect */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-amber-500/0 via-orange-500/0 to-amber-500/0 group-hover:from-amber-500/10 group-hover:via-orange-500/10 group-hover:to-amber-500/5 transition-all duration-500 pointer-events-none" />
            </div>
        </Link>
    );
}
