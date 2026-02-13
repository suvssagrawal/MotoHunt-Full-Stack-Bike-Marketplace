'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { useWishlist } from '@/context/WishlistContext';

export default function Navigation() {
    const pathname = usePathname();
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const { user, logout } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const { wishlist } = useWishlist();
    const [userMenuOpen, setUserMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { href: '/', label: 'Home' },
        { href: '/bikes', label: 'Browse Bikes' },
        { href: '/compare', label: 'Compare' },
        { href: '/dashboard', label: 'Dashboard' },
    ];

    const handleLogout = async () => {
        await logout();
        setUserMenuOpen(false);
        setMobileMenuOpen(false);
    };

    return (
        <nav
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled
                ? 'bg-black/80 backdrop-blur-xl shadow-2xl py-3'
                : 'bg-transparent py-5'
                }`}
        >
            <div className="max-w-7xl mx-auto px-4">
                <div className="flex items-center justify-between">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-3 group">
                        <div className="text-4xl group-hover:scale-110 transition-transform">
                            🏍️
                        </div>
                        <div>
                            <h1 className="text-2xl font-black gradient-text">MotoHunt</h1>
                            <p className="text-xs text-gray-400 font-medium">Premium Bikes Platform</p>
                        </div>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-8">
                        {navLinks.map(link => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`relative font-semibold text-lg transition-colors px-4 py-2 rounded-lg ${pathname === link.href
                                    ? 'text-amber-400'
                                    : 'text-gray-300 hover:text-white'
                                    }`}
                            >
                                {link.label}
                                {pathname === link.href && (
                                    <div className="absolute bottom-0 left-0 right-0 h-0.5 gradient-primary rounded-full" />
                                )}
                            </Link>
                        ))}
                    </div>

                    {/* CTA Buttons / User Menu */}
                    <div className="hidden md:flex items-center gap-4">
                        {/* Wishlist Link */}
                        <Link
                            href="/wishlist"
                            className="glass p-2.5 rounded-xl hover:glass-strong transition-all relative group"
                            aria-label="Wishlist"
                        >
                            <span className="text-xl group-hover:scale-110 block transition-transform">❤️</span>
                            {wishlist.length > 0 && (
                                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-[10px] font-bold flex items-center justify-center text-white border-2 border-black/50">
                                    {wishlist.length}
                                </span>
                            )}
                        </Link>

                        {/* Theme Toggle */}
                        <button
                            onClick={toggleTheme}
                            className="glass p-2.5 rounded-xl hover:glass-strong transition-all text-xl"
                            aria-label="Toggle Theme"
                        >
                            {theme === 'dark' ? '☀️' : '🌙'}
                        </button>

                        {user ? (
                            <div className="relative">
                                <button
                                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                                    className="flex items-center gap-3 glass px-4 py-2 rounded-xl hover:glass-strong transition-all"
                                >
                                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 flex items-center justify-center text-white font-bold">
                                        {user.username?.charAt(0).toUpperCase() || 'U'}
                                    </div>
                                    <span className="text-gray-200 font-medium">{user.username}</span>
                                    <svg className={`w-4 h-4 text-gray-400 transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </button>

                                {userMenuOpen && (
                                    <div className="absolute right-0 mt-2 w-48 glass-strong rounded-xl shadow-2xl overflow-hidden animate-scale-in border border-white/10">
                                        <Link
                                            href="/dashboard"
                                            className="block px-4 py-3 text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
                                            onClick={() => setUserMenuOpen(false)}
                                        >
                                            Dashboard
                                        </Link>
                                        <Link
                                            href="/profile"
                                            className="block px-4 py-3 text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
                                            onClick={() => setUserMenuOpen(false)}
                                        >
                                            Profile
                                        </Link>
                                        <button
                                            onClick={handleLogout}
                                            className="w-full text-left px-4 py-3 text-red-400 hover:text-red-300 hover:bg-white/10 transition-colors border-t border-white/5"
                                        >
                                            Logout
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <>
                                <Link
                                    href="/login"
                                    className="glass px-6 py-2.5 rounded-xl font-semibold text-white hover:glass-strong transition-all btn-magnetic"
                                >
                                    Login
                                </Link>
                                <Link
                                    href="/register"
                                    className="gradient-primary px-6 py-2.5 rounded-xl font-semibold text-white shadow-glow-hover btn-magnetic"
                                >
                                    Sign Up
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="md:hidden glass p-3 rounded-xl"
                    >
                        <div className="w-6 h-5 flex flex-col justify-between">
                            <span
                                className={`block h-0.5 bg-white rounded-full transition-all duration-300 ${mobileMenuOpen ? 'rotate-45 translate-y-2' : ''
                                    }`}
                            />
                            <span
                                className={`block h-0.5 bg-white rounded-full transition-all duration-300 ${mobileMenuOpen ? 'opacity-0' : ''
                                    }`}
                            />
                            <span
                                className={`block h-0.5 bg-white rounded-full transition-all duration-300 ${mobileMenuOpen ? '-rotate-45 -translate-y-2' : ''
                                    }`}
                            />
                        </div>
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            <div
                className={`md:hidden fixed inset-0 top-[70px] bg-black/95 backdrop-blur-xl transition-all duration-300 ${mobileMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
                    }`}
                onClick={() => setMobileMenuOpen(false)}
            >
                <div className="max-w-7xl mx-auto px-4 py-8 flex flex-col gap-4">
                    {navLinks.map((link, index) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={`glass-strong px-6 py-4 rounded-xl font-semibold text-lg transition-all ${pathname === link.href
                                ? 'gradient-primary text-white'
                                : 'text-gray-300 hover:text-white'
                                }`}
                            style={{
                                animation: mobileMenuOpen
                                    ? `slideUp 0.3s cubic-bezier(0.4, 0, 0.2, 1) ${index * 0.1}s forwards`
                                    : 'none',
                                opacity: 0,
                                transform: 'translateY(20px)'
                            }}
                        >
                            {link.label}
                        </Link>
                    ))}

                    <div className="flex flex-col gap-3 mt-4 border-t border-white/10 pt-4">
                        <button
                            onClick={toggleTheme}
                            className="glass-strong px-6 py-4 rounded-xl font-semibold text-center text-white hover:bg-white/10 transition-colors"
                        >
                            {theme === 'dark' ? '☀️ Light Mode' : '🌙 Dark Mode'}
                        </button>

                        {user ? (
                            <>
                                <div className="glass-strong px-6 py-4 rounded-xl flex items-center gap-3 mb-2">
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 flex items-center justify-center text-white font-bold text-lg">
                                        {user.username?.charAt(0).toUpperCase() || 'U'}
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-white font-bold">{user.username}</span>
                                        <span className="text-gray-400 text-sm">{user.email}</span>
                                    </div>
                                </div>
                                <button
                                    onClick={handleLogout}
                                    className="glass-strong px-6 py-4 rounded-xl font-semibold text-center text-red-400 hover:bg-white/10 transition-colors"
                                >
                                    Sign Out
                                </button>
                            </>
                        ) : (
                            <>
                                <Link
                                    href="/login"
                                    className="glass-strong px-6 py-4 rounded-xl font-semibold text-center text-white hover:bg-white/10 transition-colors"
                                >
                                    Login
                                </Link>
                                <Link
                                    href="/register"
                                    className="gradient-primary px-6 py-4 rounded-xl font-semibold text-center text-white shadow-glow"
                                >
                                    Sign Up
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}
