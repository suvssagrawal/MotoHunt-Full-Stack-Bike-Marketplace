'use client';

import { Inter } from 'next/font/google';
import './globals.css';
import './animations.css';
import { AuthProvider } from '@/context/AuthContext';
import { ToastProvider } from '@/components/ToastNotification';
import { ThemeProvider } from '@/context/ThemeContext';
import { WishlistProvider } from '@/context/WishlistContext';
import Navigation from '@/components/Navigation';
import BackToTop from '@/components/BackToTop';
import Link from 'next/link';

const inter = Inter({ subsets: ['latin'] });

function Footer() {
    return (
        <footer className="glass-strong border-t border-white/10 mt-32">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
                    {/* Brand */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <span className="text-4xl">🏍️</span>
                            <h3 className="text-2xl font-black gradient-text">MotoHunt</h3>
                        </div>
                        <p className="text-gray-300 leading-relaxed">
                            India's #1 premium motorcycle platform. Find your perfect ride today!
                        </p>
                        <div className="flex gap-4">
                            {['facebook', 'twitter', 'instagram', 'youtube'].map(social => (
                                <a
                                    key={social}
                                    href="#"
                                    className="glass p-3 rounded-xl hover:glass-strong transition-all btn-magnetic"
                                    aria-label={social}
                                >
                                    <svg className="w-5 h-5 text-amber-400" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" />
                                    </svg>
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="font-bold text-white mb-6 text-lg">Quick Links</h4>
                        <ul className="space-y-3">
                            {[
                                { href: '/bikes', label: 'Browse Bikes' },
                                { href: '/compare', label: 'Compare' },
                                { href: '/dealers', label: 'Find Dealers' },
                                { href: '/about', label: 'About Us' }
                            ].map(link => (
                                <li key={link.href}>
                                    <Link
                                        href={link.href}
                                        className="text-gray-300 hover:text-amber-400 transition-colors inline-flex items-center gap-2"
                                    >
                                        <span className="text-amber-400">→</span>
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Support */}
                    <div>
                        <h4 className="font-bold text-white mb-6 text-lg">Support</h4>
                        <ul className="space-y-3">
                            {[
                                { href: '#', label: 'Help Center' },
                                { href: '#', label: 'Contact Us' },
                                { href: '#', label: 'FAQ' },
                                { href: '#', label: 'Feedback' }
                            ].map(link => (
                                <li key={link.label}>
                                    <Link
                                        href={link.href}
                                        className="text-gray-300 hover:text-amber-400 transition-colors inline-flex items-center gap-2"
                                    >
                                        <span className="text-amber-400">→</span>
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Newsletter */}
                    <div>
                        <h4 className="font-bold text-white mb-6 text-lg">Stay Updated</h4>
                        <p className="text-gray-300 mb-4">
                            Subscribe to get latest bikes & offers
                        </p>
                        <div className="flex gap-2">
                            <input
                                type="email"
                                placeholder="Your email"
                                className="glass px-4 py-3 rounded-xl flex-1 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
                            />
                            <button className="gradient-primary px-6 py-3 rounded-xl font-semibold shadow-glow-hover btn-magnetic">
                                →
                            </button>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="mt-12 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-gray-400">
                        © 2026 MotoHunt. All rights reserved.
                    </p>
                    <div className="flex gap-6">
                        <Link href="#" className="text-gray-400 hover:text-amber-400 transition-colors">
                            Privacy Policy
                        </Link>
                        <Link href="#" className="text-gray-400 hover:text-amber-400 transition-colors">
                            Terms of Service
                        </Link>
                        <Link href="#" className="text-gray-400 hover:text-amber-400 transition-colors">
                            Cookie Policy
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body className={inter.className}>
                <AuthProvider>
                    <ThemeProvider>
                        <ToastProvider>
                            <WishlistProvider>
                                <Navigation />
                                <main className="pt-20">
                                    {children}
                                </main>
                                <Footer />
                                <BackToTop />
                            </WishlistProvider>
                        </ToastProvider>
                    </ThemeProvider>
                </AuthProvider>
            </body>
        </html>
    );
}
