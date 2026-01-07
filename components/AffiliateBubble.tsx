'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export interface AffiliateOffer {
    id: string;
    icon: string;
    title: string;
    subtitle: string;
    link: string;
    color: string;
}

export const affiliateOffers: AffiliateOffer[] = [
    {
        id: 'kast-bank',
        icon: '🏦',
        title: 'Get $20 Bonus',
        subtitle: 'Free Platinum Card with Kast Bank',
        link: 'https://example.com/kast?ref=calctheater',
        color: '#d4a574'
    },
    {
        id: 'bleep-card',
        icon: '💳',
        title: 'Free Bleep Card',
        subtitle: 'No fees, instant approval',
        link: 'https://example.com/bleep?ref=calctheater',
        color: '#c9b896'
    },
    {
        id: 'audible',
        icon: '🎧',
        title: '1 Free Audiobook',
        subtitle: '30-day trial with Audible',
        link: 'https://example.com/audible?ref=calctheater',
        color: '#e8d5b7'
    }
];

interface AffiliateBubbleProps {
    isVisible: boolean;
    onClose: () => void;
    offer: AffiliateOffer | null;
}

const AffiliateBubble: React.FC<AffiliateBubbleProps> = ({ isVisible, onClose, offer }) => {
    return (
        <AnimatePresence>
            {isVisible && offer && (
                <div className="fixed inset-0 flex items-end justify-center pb-20 px-4 pointer-events-none z-[100]">
                    <motion.div
                        initial={{ y: '150%', opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: '150%', opacity: 0 }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="relative w-full max-w-md pointer-events-auto"
                        style={{
                            background: 'rgba(245, 240, 230, 0.85)',
                            backdropFilter: 'blur(20px)',
                            WebkitBackdropFilter: 'blur(20px)',
                            borderRadius: '32px',
                            border: '2px solid rgba(255, 255, 255, 0.3)',
                            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3), 0 0 1px rgba(255, 255, 255, 0.5) inset',
                            padding: '32px',
                        }}
                    >
                        {/* Close button */}
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full transition-all hover:scale-110 active:scale-90"
                            style={{
                                background: 'rgba(255, 255, 255, 0.5)',
                                backdropFilter: 'blur(10px)',
                                color: '#8b7355'
                            }}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                        </button>

                        {/* Icon/Logo */}
                        <div
                            className="w-16 h-16 rounded-full flex items-center justify-center text-4xl mb-4 mx-auto"
                            style={{
                                background: 'rgba(255, 255, 255, 0.6)',
                                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
                            }}
                        >
                            {offer.icon}
                        </div>

                        {/* Content */}
                        <div className="text-center mb-6">
                            <h3
                                className="text-2xl font-semibold mb-2 font-exo"
                                style={{
                                    color: offer.color,
                                    textShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
                                }}
                            >
                                {offer.title}
                            </h3>
                            <p
                                className="text-base font-exo"
                                style={{
                                    color: 'rgba(100, 90, 80, 0.8)'
                                }}
                            >
                                {offer.subtitle}
                            </p>
                        </div>

                        {/* CTA Button */}
                        <a
                            href={offer.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block w-full py-4 rounded-full text-center font-semibold font-exo transition-all hover:scale-105 active:scale-95"
                            style={{
                                background: 'rgba(250, 245, 235, 0.9)',
                                color: '#8b7355',
                                fontSize: '18px',
                                boxShadow: '0 8px 20px rgba(0, 0, 0, 0.15)',
                                border: '1px solid rgba(255, 255, 255, 0.5)'
                            }}
                        >
                            Learn More →
                        </a>

                        {/* Small disclaimer */}
                        <p
                            className="text-xs text-center mt-4 opacity-60 font-exo"
                            style={{
                                color: '#8b7355'
                            }}
                        >
                            Sponsored · We may earn a commission
                        </p>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default AffiliateBubble;
