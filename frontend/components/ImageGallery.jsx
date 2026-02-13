'use client';
import { useState, useEffect } from 'react';

export default function ImageGallery({ images, modelName }) {
    const [selectedImage, setSelectedImage] = useState(0);
    const [isLightboxOpen, setIsLightboxOpen] = useState(false);

    // If no images provided, use a placeholder
    const galleryImages = images && images.length > 0 ? images : [null];

    const handleKeyDown = (e) => {
        if (!isLightboxOpen) return;
        if (e.key === 'Escape') setIsLightboxOpen(false);
        if (e.key === 'ArrowRight') setSelectedImage((prev) => (prev + 1) % galleryImages.length);
        if (e.key === 'ArrowLeft') setSelectedImage((prev) => (prev - 1 + galleryImages.length) % galleryImages.length);
    };

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isLightboxOpen]);

    return (
        <div className="space-y-4">
            {/* Main Image */}
            <div
                className="glass-strong rounded-3xl overflow-hidden border border-gray-700 shadow-glow relative group cursor-zoom-in aspect-[4/3] md:aspect-[16/9]"
                onClick={() => setIsLightboxOpen(true)}
            >
                {galleryImages[selectedImage] ? (
                    <img
                        src={galleryImages[selectedImage]}
                        alt={`${modelName} - View ${selectedImage + 1}`}
                        className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-900/50">
                        <span className="text-6xl">🏍️</span>
                    </div>
                )}

                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 bg-black/50 backdrop-blur-md text-white px-6 py-3 rounded-full flex items-center gap-2">
                        <span className="text-xl">🔍</span>
                        <span className="font-semibold">View Fullscreen</span>
                    </div>
                </div>
            </div>

            {/* Thumbnails */}
            {galleryImages.length > 1 && (
                <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                    {galleryImages.map((img, index) => (
                        <button
                            key={index}
                            onClick={() => setSelectedImage(index)}
                            className={`relative flex-shrink-0 w-24 h-24 rounded-xl overflow-hidden border-2 transition-all ${selectedImage === index
                                    ? 'border-amber-500 shadow-glow scale-105'
                                    : 'border-transparent opacity-60 hover:opacity-100'
                                }`}
                        >
                            {img ? (
                                <img
                                    src={img}
                                    alt={`Thumbnail ${index + 1}`}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                                    <span className="text-2xl">🏍️</span>
                                </div>
                            )}
                        </button>
                    ))}
                </div>
            )}

            {/* Lightbox Modal */}
            {isLightboxOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-xl animate-fade-in">
                    {/* Close Button */}
                    <button
                        onClick={() => setIsLightboxOpen(false)}
                        className="absolute top-6 right-6 p-4 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all z-50"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>

                    {/* Navigation Buttons */}
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            setSelectedImage((prev) => (prev - 1 + galleryImages.length) % galleryImages.length);
                        }}
                        className="absolute left-6 p-4 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all hover:scale-110"
                    >
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>

                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            setSelectedImage((prev) => (prev + 1) % galleryImages.length);
                        }}
                        className="absolute right-6 p-4 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all hover:scale-110"
                    >
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </button>

                    {/* Fullscreen Image */}
                    <div className="relative w-full h-full max-w-7xl max-h-[90vh] p-4 flex items-center justify-center">
                        {galleryImages[selectedImage] ? (
                            <img
                                src={galleryImages[selectedImage]}
                                alt={`${modelName} - Fullscreen`}
                                className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
                            />
                        ) : (
                            <div className="text-9xl animate-pulse">🏍️</div>
                        )}

                        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 bg-black/50 px-6 py-2 rounded-full text-white backdrop-blur-md border border-white/10">
                            {selectedImage + 1} / {galleryImages.length}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
