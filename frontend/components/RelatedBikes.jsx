'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function RelatedBikes({ currentBikeId, type, price }) {
    const [relatedBikes, setRelatedBikes] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (type) {
            fetchRelatedBikes();
        }
    }, [type, currentBikeId]);

    const fetchRelatedBikes = async () => {
        try {
            // Simple recommendation logic: same type, exclude current
            const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
            const res = await fetch(`${API_URL}/api/bikes?type=${type}&limit=4`);
            const data = await res.json();

            if (data.bikes) {
                const filtered = data.bikes
                    .filter(bike => bike.id !== parseInt(currentBikeId))
                    .slice(0, 3);
                setRelatedBikes(filtered);
            }
        } catch (error) {
            console.error('Failed to fetch related bikes:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading || relatedBikes.length === 0) return null;

    return (
        <div className="mb-12 border-t border-white/10 pt-12">
            <h3 className="text-3xl font-bold mb-8">
                <span className="gradient-text">Similar Bikes</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {relatedBikes.map(bike => (
                    <Link
                        href={`/bikes/${bike.id}`}
                        key={bike.id}
                        className="glass rounded-2xl overflow-hidden group hover:border-amber-500/50 transition-all block"
                    >
                        <div className="h-48 overflow-hidden relative">
                            {bike.image_url ? (
                                <img
                                    src={bike.image_url}
                                    alt={bike.model_name}
                                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                                />
                            ) : (
                                <div className="w-full h-full bg-gray-900 flex items-center justify-center text-4xl">
                                    🏍️
                                </div>
                            )}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                            <div className="absolute bottom-3 left-4">
                                <p className="font-bold text-white text-lg">{bike.model_name}</p>
                                <p className="text-amber-400 font-bold">₹{(bike.price_on_road / 100000).toFixed(2)}L</p>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}
