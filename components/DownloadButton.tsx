'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function DownloadButton() {
    const [mounted, setMounted] = useState(false);
    const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
    const [isInstalled, setIsInstalled] = useState(false);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        setMounted(true);

        const isStandalone = window.matchMedia('(display-mode: standalone)').matches
            || (window.navigator as any).standalone
            || document.referrer.includes('android-app://');

        setIsInstalled(isStandalone);

        // Fallback: show button after 2 seconds if not installed, even without prompt
        const initialTimer = setTimeout(() => {
            if (!isStandalone) {
                setIsVisible(true);
            }
        }, 2000);

        const handleBeforeInstallPrompt = (e: Event) => {
            e.preventDefault();
            setDeferredPrompt(e);
            if (!isStandalone) {
                setIsVisible(true);
            }
        };

        const handleAppInstalled = () => {
            setDeferredPrompt(null);
            setIsInstalled(true);
            setIsVisible(false);
        };

        window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        window.addEventListener('appinstalled', handleAppInstalled);

        return () => {
            clearTimeout(initialTimer);
            window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
            window.removeEventListener('appinstalled', handleAppInstalled);
        };
    }, []);

    const handleInstallClick = async () => {
        if (!deferredPrompt) {
            // If we don't have the prompt, fallback to the website link
            window.open('https://mathica.xyz', '_blank');
            return;
        }

        // Show the install prompt
        deferredPrompt.prompt();

        // Wait for the user to respond to the prompt
        const { outcome } = await deferredPrompt.userChoice;
        console.log(`User response to the install prompt: ${outcome}`);

        // We've used the prompt, and can't use it again, throw it away
        setDeferredPrompt(null);
        if (outcome === 'accepted') {
            setIsVisible(false);
        }
    };

    // Prevent hydration mismatch by returning null until mounted
    if (!mounted || isInstalled || !isVisible) return null;

    return (
        <AnimatePresence>
            <motion.button
                onClick={handleInstallClick}
                initial={{ opacity: 0, y: 20, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                whileHover={{
                    scale: 1.05,
                    boxShadow: '0 0 25px rgba(201, 184, 150, 0.4)'
                }}
                whileTap={{ scale: 0.95 }}
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '12px',
                    background: '#262626', // Charcoal
                    color: '#c9b896', // Champagne
                    padding: '12px 24px',
                    borderRadius: '20px',
                    fontSize: '1rem',
                    fontWeight: '700',
                    fontFamily: "'Exo 2', sans-serif",
                    border: '2px solid rgba(201, 184, 150, 0.3)',
                    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.25)',
                    textDecoration: 'none',
                    marginTop: '2rem',
                    cursor: 'pointer',
                    transition: 'border-color 0.3s'
                }}
            >
                <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v4" />
                    <polyline points="7 10 12 15 17 10" />
                    <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
                <span>Download Mathica</span>
            </motion.button>
        </AnimatePresence>
    );
}
