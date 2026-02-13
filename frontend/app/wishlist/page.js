'use client';

import { useWishlist } from '@/context/WishlistContext';
import BikeCard from '@/components/BikeCard';
import ScrollReveal from '@/components/ScrollReveal';
import Link from 'next/link';

export default function WishlistPage() {
    const { wishlist } = useWishlist();

    return (
        <div className="min-h-screen py-12 px-4">
            <div className="max-w-7xl mx-auto">
                <ScrollReveal animation="fade-up">
                    <div className="text-center mb-16">
                        <h1 className="text-5xl font-black mb-4">
                            <span className="gradient-text text-glow">Your Dream Garage</span>
                        </h1>
                        <p className="text-gray-400 text-xl">
                            {wishlist.length} {wishlist.length === 1 ? 'bike' : 'bikes'} saved for later
                        </p>
                    </div>
                </ScrollReveal>

                {wishlist.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                        {wishlist.map((bike, index) => (
                            <ScrollReveal key={bike.id} animation="fade-up" delay={index * 50}>
                                <BikeCard bike={bike} />
                            </ScrollReveal>
                        ))}
                    </div>
                ) : (
                    <div className="glass-3d rounded-3xl p-16 text-center max-w-2xl mx-auto neon-border">
                        <div className="text-8xl mb-6 animate-pulse-slow">💔</div>
                        <h3 className="text-3xl font-bold text-white mb-4">Your garage is empty</h3>
                        <p className="text-gray-400 mb-8 text-lg">
                            Start adding some premium rides to your collection!
                        </p>
                        <Link
                            href="/bikes"
                            className="gradient-primary px-8 py-4 rounded-xl font-bold shadow-glow-hover btn-magnetic inline-block text-white"
                        >
                            Browse Bikes
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}
