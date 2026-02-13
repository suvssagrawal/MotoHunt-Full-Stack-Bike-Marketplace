'use client';
import { useState, useEffect } from 'react';
import { useToast } from '@/components/ToastNotification';

export default function ShareButton({ title, text, url }) {
    const [isOpen, setIsOpen] = useState(false);
    const { showToast } = useToast();
    const shareUrl = typeof window !== 'undefined' ? (url || window.location.href) : '';

    const handleShare = async (platform) => {
        const encodedText = encodeURIComponent(text);
        const encodedUrl = encodeURIComponent(shareUrl);

        let link = '';
        switch (platform) {
            case 'copy':
                try {
                    await navigator.clipboard.writeText(shareUrl);
                    showToast('Link copied to clipboard!', 'success');
                    setIsOpen(false);
                } catch (err) {
                    showToast('Failed to copy link', 'error');
                }
                return;
            case 'whatsapp':
                link = `https://wa.me/?text=${encodedText}%20${encodedUrl}`;
                break;
            case 'twitter':
                link = `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`;
                break;
            case 'facebook':
                link = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
                break;
            case 'email':
                link = `mailto:?subject=${encodeURIComponent(title)}&body=${encodedText}%0A%0A${encodedUrl}`;
                break;
            default:
                break;
        }

        if (link) {
            window.open(link, '_blank');
            setIsOpen(false);
        }
    };

    // Close on escape
    useEffect(() => {
        const handleEsc = (e) => {
            if (e.key === 'Escape') setIsOpen(false);
        };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, []);

    // Close on click outside
    useEffect(() => {
        if (!isOpen) return;
        const handleClickOutside = (e) => {
            if (e.target.closest('.share-modal-content')) return;
            setIsOpen(false);
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isOpen]);

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="glass p-3 rounded-full hover:glass-strong transition-all text-gray-300 hover:text-amber-500"
                title="Share"
            >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92 1.61 0 2.92-1.31 2.92-2.92s-1.31-2.92-2.92-2.92z" />
                </svg>
            </button>

            {/* Modal */}
            {isOpen && (
                <div className="absolute top-12 right-0 z-50 animate-fade-in-up origin-top-right">
                    <div className="share-modal-content glass-strong rounded-2xl p-4 border border-gray-700 shadow-2xl w-64">
                        <h4 className="text-white font-bold mb-3 px-2">Share via</h4>
                        <div className="space-y-1">
                            {[
                                { id: 'copy', label: 'Copy Link', icon: '📋', color: 'text-gray-300' },
                                { id: 'whatsapp', label: 'WhatsApp', icon: '💬', color: 'text-green-500' },
                                { id: 'twitter', label: 'Twitter', icon: '🐦', color: 'text-blue-400' },
                                { id: 'facebook', label: 'Facebook', icon: '📘', color: 'text-blue-600' },
                                { id: 'email', label: 'Email', icon: '✉️', color: 'text-red-400' }
                            ].map((option) => (
                                <button
                                    key={option.id}
                                    onClick={() => handleShare(option.id)}
                                    className="w-full flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-white/10 transition-colors text-left group"
                                >
                                    <span className="text-xl transform group-hover:scale-110 transition-transform">{option.icon}</span>
                                    <span className={`text-sm font-medium ${option.color} group-hover:text-white transition-colors`}>
                                        {option.label}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
