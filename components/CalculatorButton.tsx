'use client';

import { motion, useAnimation } from 'framer-motion';
import { useState } from 'react';

interface CalculatorButtonProps {
    value: string;
    onClick: () => void;
    buttonType: 'number' | 'operator' | 'utility' | 'backspace';
}

export default function CalculatorButton({ value, onClick, buttonType }: CalculatorButtonProps) {
    const [isHovered, setIsHovered] = useState(false);
    const controls = useAnimation();

    const getColor = () => {
        if (buttonType === 'operator') {
            return {
                bg: 'linear-gradient(135deg, rgba(245, 245, 220, 0.95) 0%, rgba(235, 235, 210, 0.85) 100%)',
                text: '#4A4A3A',
                glow: 'rgba(245, 245, 220, 0.7)',
                shadow: '0 18px 50px rgba(200, 200, 150, 0.35)'
            };
        }
        if (buttonType === 'utility' || buttonType === 'backspace') {
            return {
                bg: 'linear-gradient(135deg, rgba(210, 180, 140, 0.45) 0%, rgba(205, 175, 135, 0.25) 100%)',
                text: '#D2B48C',
                glow: 'rgba(210, 180, 140, 0.5)',
                shadow: '0 15px 40px rgba(210, 180, 140, 0.25)'
            };
        }
        return {
            bg: 'linear-gradient(135deg, rgba(250, 250, 235, 0.28) 0%, rgba(245, 245, 230, 0.12) 100%)',
            text: '#F5F5DC',
            glow: 'rgba(250, 250, 235, 0.35)',
            shadow: '0 15px 40px rgba(0, 0, 0, 0.25)'
        };
    };

    const colors = getColor();

    const handleInteraction = () => {
        controls.start({
            scale: [1, 0.85, 1.1, 1],
            rotate: [0, -5, 5, 0],
            transition: { duration: 0.4 }
        });

        if ('vibrate' in navigator) {
            navigator.vibrate(15);
        }
        onClick();
    };

    return (
        <motion.div
            animate={controls}
            className="relative flex items-center justify-center pointer-events-auto"
            onHoverStart={() => setIsHovered(true)}
            onHoverEnd={() => setIsHovered(false)}
            whileHover={{
                scale: 1.15,
                zIndex: 20,
                transition: { duration: 0.2 }
            }}
            style={{
                aspectRatio: '1/1',
            }}
        >
            <motion.button
                onClick={handleInteraction}
                animate={{
                    y: [0, -5, 0],
                }}
                transition={{
                    y: {
                        duration: 3 + Math.random(),
                        repeat: Infinity,
                        ease: "easeInOut"
                    }
                }}
                style={{
                    width: '100%',
                    height: '100%',
                    borderRadius: '50%',
                    background: colors.bg,
                    backdropFilter: 'blur(20px)',
                    border: '2px solid rgba(250, 250, 235, 0.3)',
                    boxShadow: `
            ${colors.shadow},
            inset 0 0 25px ${colors.glow},
            inset 10px 10px 20px rgba(255, 255, 255, 0.15),
            inset -10px -10px 20px rgba(0, 0, 0, 0.12)
          `,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: buttonType === 'utility' ? '1.2rem' : '1.8rem',
                    fontWeight: '700',
                    color: colors.text,
                    fontFamily: "'Exo 2', sans-serif",
                    textShadow: `0 2px 8px ${colors.glow}`,
                    transformStyle: 'preserve-3d',
                    userSelect: 'none',
                    position: 'relative',
                    overflow: 'hidden'
                }}
            >
                <div style={{
                    position: 'absolute',
                    inset: '10%',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.35) 0%, transparent 50%)',
                    pointerEvents: 'none'
                }} />

                <span className="relative z-10">{value === '⌫' ? '<' : value}</span>

                {isHovered && (
                    <motion.div
                        initial={{ scale: 1, opacity: 0.5 }}
                        animate={{ scale: 1.8, opacity: 0 }}
                        transition={{ duration: 0.8, repeat: Infinity }}
                        style={{
                            position: 'absolute',
                            inset: -10,
                            borderRadius: '50%',
                            background: colors.glow,
                            filter: 'blur(20px)',
                            pointerEvents: 'none'
                        }}
                    />
                )}
            </motion.button>
        </motion.div>
    );
}
