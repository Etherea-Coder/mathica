'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

export default function MajesticBubbles() {
    const [bubbles, setBubbles] = useState<any[]>([]);

    useEffect(() => {
        // Generate bubbles only on the client to avoid hydration mismatch
        setBubbles(
            Array.from({ length: 25 }, (_, i) => ({
                id: i,
                size: 30 + Math.random() * 100,
                delay: Math.random() * 10,
                duration: 18 + Math.random() * 12,
                startX: Math.random() * 100,
                driftX: (Math.random() - 0.5) * 150,
                opacity: 0.12 + Math.random() * 0.18
            }))
        );
    }, []);

    if (bubbles.length === 0) return null;

    return (
        <div style={{
            position: 'fixed',
            inset: 0,
            pointerEvents: 'none',
            overflow: 'hidden',
            zIndex: 1
        }}>
            {bubbles.map((bubble) => (
                <motion.div
                    key={bubble.id}
                    style={{
                        position: 'absolute',
                        width: bubble.size,
                        height: bubble.size,
                        left: `${bubble.startX}%`,
                        bottom: '-120px',
                        borderRadius: '50%',
                        background: `radial-gradient(circle at 35% 35%, 
              rgba(255, 255, 255, ${bubble.opacity * 1.8}), 
              rgba(255, 255, 255, ${bubble.opacity * 1.2}) 35%, 
              rgba(255, 255, 255, ${bubble.opacity * 0.5}) 65%, 
              rgba(255, 255, 255, 0.02))`,
                        backdropFilter: 'blur(1px)',
                        border: '1.5px solid rgba(255, 255, 255, 0.25)',
                        boxShadow: `
              inset -8px -8px 16px rgba(255, 255, 255, 0.2),
              inset 6px 6px 12px rgba(0, 0, 0, 0.08),
              0 0 30px rgba(255, 255, 255, 0.08)
            `
                    }}
                    animate={{
                        y: [0, -(window.innerHeight + 150)],
                        x: [0, bubble.driftX],
                        scale: [0.9, 1.05, 0.95, 1],
                        opacity: [0, bubble.opacity, bubble.opacity * 0.9, 0]
                    }}
                    transition={{
                        duration: bubble.duration,
                        delay: bubble.delay,
                        repeat: Infinity,
                        ease: "linear"
                    }}
                />
            ))}
        </div>
    );
}
