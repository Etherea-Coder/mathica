'use client';

import React from 'react';
import { motion } from 'framer-motion';

export default function DownloadButton() {
    return (
        <motion.a
            href="https://mathica.xyz" // As requested
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
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
                transition: 'border-color 0.3s'
            }}
            onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'rgba(201, 184, 150, 0.6)')}
            onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'rgba(201, 184, 150, 0.3)')}
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
        </motion.a>
    );
}
