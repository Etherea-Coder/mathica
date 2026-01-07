'use client';

import { motion, useMotionValue, useTransform, animate } from 'framer-motion';
import { useCalculatorStore } from '@/store/calculatorStore';
import { useState, useEffect } from 'react';

export default function SwipeBar() {
    const x = useMotionValue(0);
    const [isDragging, setIsDragging] = useState(false);
    const [progress, setProgress] = useState(0);
    const [mounted, setMounted] = useState(false);
    const calculate = useCalculatorStore((state) => state.calculate);

    useEffect(() => {
        setMounted(true);
        // Track x changes to update progress state for UI feedback
        const unsubscribe = x.on('change', (latest) => {
            const maxDrag = 380; // Match the dragConstraints right value
            setProgress(Math.min(Math.max(latest / maxDrag, 0), 1));
        });
        return unsubscribe;
    }, [x]);

    if (!mounted) return null;

    const handleDragEnd = () => {
        setIsDragging(false);
        if (progress >= 0.8) {
            if ('vibrate' in navigator) {
                navigator.vibrate([30, 10, 30]);
            }
            calculate();
        }

        // Smoothly return to start
        animate(x, 0, {
            type: "spring",
            stiffness: 300,
            damping: 30
        });
        setProgress(0);
    };

    const handleSize = 90;
    const halfHandle = handleSize / 2;

    return (
        <div style={{
            position: 'absolute',
            left: 0,
            top: '20px', // Shifted up slightly from 60px as requested
            width: '100%',
            height: 0, // No height for the container to avoid blocking keypad
            zIndex: 100,
            pointerEvents: 'none',
            display: 'flex',
            alignItems: 'center'
        }}>
            {/* Horizontal track line */}
            <div style={{
                position: 'relative',
                width: '100%',
                height: '6px',
                background: 'linear-gradient(90deg, rgba(201, 184, 150, 0.2) 0%, rgba(201, 184, 150, 0.4) 100%)',
                backdropFilter: 'blur(10px)',
                borderRadius: '3px',
                boxShadow: '0 0 15px rgba(0, 0, 0, 0.2)',
                border: '1px solid rgba(201, 184, 150, 0.15)',
            }}>
                {/* Progress fill (Champagne) */}
                <motion.div
                    style={{
                        position: 'absolute',
                        left: 0,
                        top: 0,
                        bottom: 0,
                        width: `${progress * 100}%`,
                        background: `linear-gradient(90deg, 
              rgba(201, 184, 150, 0.4) 0%, 
              rgba(201, 184, 150, 0.8) 100%)`,
                        borderRadius: '3px',
                        boxShadow: '0 0 20px rgba(201, 184, 150, 0.4)',
                    }}
                />

                {/* Draggable handle (The "=" ball) */}
                <motion.div
                    style={{
                        position: 'absolute',
                        left: -halfHandle, // Half-outside the track on the left
                        top: '50%',
                        x,
                        y: '-50%',
                        width: handleSize,
                        height: handleSize,
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, rgba(245, 245, 235, 0.98) 0%, rgba(220, 210, 180, 0.95) 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '2.5rem',
                        fontWeight: '700',
                        color: '#8B7355',
                        cursor: 'grab',
                        boxShadow: `
              0 10px 30px rgba(0, 0, 0, 0.3),
              0 0 25px rgba(201, 184, 150, 0.4),
              inset 0 2px 4px rgba(255, 255, 255, 0.4)
            `,
                        border: '3px solid rgba(201, 184, 150, 0.5)',
                        pointerEvents: 'auto',
                        touchAction: 'none'
                    }}
                    drag="x"
                    dragConstraints={{ left: 0, right: 380 }} // Constrained within typical calc width
                    dragElastic={0.05}
                    onDragStart={() => setIsDragging(true)}
                    onDragEnd={handleDragEnd}
                    whileHover={{ scale: 1.1 }}
                    whileDrag={{
                        cursor: 'grabbing',
                        scale: 1.15,
                        boxShadow: '0 15px 40px rgba(0, 0, 0, 0.4), 0 0 40px rgba(201, 184, 150, 0.6)'
                    }}
                >
                    <motion.span
                        animate={{ rotate: isDragging ? 360 : 0 }}
                        transition={{ duration: 2, repeat: isDragging ? Infinity : 0, ease: "linear" }}
                    >
                        =
                    </motion.span>

                    {isDragging && (
                        <motion.div
                            style={{
                                position: 'absolute',
                                inset: -15,
                                borderRadius: '50%',
                                background: 'radial-gradient(circle, rgba(201, 184, 150, 0.3), transparent 70%)',
                                filter: 'blur(10px)',
                                pointerEvents: 'none'
                            }}
                            animate={{ scale: [1, 1.3, 1], opacity: [0.6, 0.3, 0.6] }}
                            transition={{ duration: 1, repeat: Infinity }}
                        />
                    )}
                </motion.div>

                {/* Subtle hint text */}
                {!isDragging && progress === 0 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.8 }}
                        style={{
                            position: 'absolute',
                            left: '60px',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            color: 'rgba(201, 184, 150, 0.9)',
                            fontSize: '0.8rem',
                            fontWeight: '600',
                            fontFamily: "'Exo 2', sans-serif",
                            whiteSpace: 'nowrap',
                            pointerEvents: 'none',
                            textShadow: '0 1px 3px rgba(0, 0, 0, 0.3)'
                        }}
                    >
                        → Slide to calculate
                    </motion.div>
                )}
            </div>
        </div>
    );
}
