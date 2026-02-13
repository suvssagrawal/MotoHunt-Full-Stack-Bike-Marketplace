'use client';
import { createContext, useContext, useEffect, useState } from 'react';
import { useToast } from '@/components/ToastNotification';

const WishlistContext = createContext();

export function WishlistProvider({ children }) {
    const [wishlist, setWishlist] = useState([]);
    const { showToast } = useToast();

    // Load wishlist from localStorage on mount
    useEffect(() => {
        const storedWishlist = localStorage.getItem('wishlist');
        if (storedWishlist) {
            setWishlist(JSON.parse(storedWishlist));
        }
    }, []);

    // Helper to check if item is in wishlist
    const isInWishlist = (bikeId) => {
        return wishlist.some(item => item.id === bikeId);
    };

    // Add or remove item
    const toggleWishlist = (bike) => {
        if (isInWishlist(bike.id)) {
            // Remove
            const newWishlist = wishlist.filter(item => item.id !== bike.id);
            setWishlist(newWishlist);
            localStorage.setItem('wishlist', JSON.stringify(newWishlist));
            showToast('Removed from wishlist', 'info');
        } else {
            // Add
            const newWishlist = [...wishlist, bike];
            setWishlist(newWishlist);
            localStorage.setItem('wishlist', JSON.stringify(newWishlist));
            showToast('Added to wishlist', 'success');
        }
    };

    return (
        <WishlistContext.Provider value={{ wishlist, toggleWishlist, isInWishlist }}>
            {children}
        </WishlistContext.Provider>
    );
}

export const useWishlist = () => useContext(WishlistContext);
