'use client';

import { motion } from 'framer-motion';
import { useCalculatorStore } from '@/store/calculatorStore';

export default function DisplayCard() {
    const display = useCalculatorStore((state) => state.display);
    const previousValue = useCalculatorStore((state) => state.previousValue);
    const operation = useCalculatorStore((state) => state.operation);
    const currentValue = useCalculatorStore((state) => state.currentValue);

    const getOperatorSymbol = (op: string | null) => {
        const symbols: Record<string, string> = { add: '+', subtract: '-', multiply: '×', divide: '÷' };
        return op ? symbols[op] || '' : '';
    };

    let fullExpression = display || '0';
    if (previousValue && operation) {
        fullExpression = (currentValue === '0' || currentValue === '')
            ? `${previousValue} ${getOperatorSymbol(operation)}`
            : `${previousValue} ${getOperatorSymbol(operation)} ${currentValue}`;
    }

    // Responsive font size based on expression length
    const getFontSize = () => {
        const len = fullExpression.length;
        if (len > 20) return 'clamp(1.2rem, 4vw, 2rem)';
        if (len > 15) return 'clamp(1.5rem, 5vw, 2.5rem)';
        if (len > 10) return 'clamp(2rem, 7vw, 3.5rem)';
        return 'clamp(2.5rem, 10vw, 5rem)';
    };

    return (
        <motion.div
            key={fullExpression}
            initial={{ opacity: 0, scale: 0.8, y: -50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            className="display-bar w-full"
            style={{
                padding: '1.5rem 2rem',
                marginBottom: '3rem',
                background: 'linear-gradient(135deg, rgba(250, 250, 235, 0.22) 0%, rgba(245, 245, 230, 0.08) 100%)',
                backdropFilter: 'blur(30px) saturate(150%)',
                borderRadius: '40px',
                border: '2px solid rgba(250, 250, 235, 0.3)',
                boxShadow: `
          0 25px 70px rgba(0, 0, 0, 0.35),
          inset 0 1px 0 rgba(255, 255, 255, 0.3),
          inset 0 -1px 0 rgba(0, 0, 0, 0.15)
        `,
                textAlign: 'right',
                fontFamily: "'Exo 2', sans-serif",
                fontWeight: '700',
                fontSize: getFontSize(),
                color: '#c9b896',
                textShadow: `
          0 0 15px rgba(201, 184, 150, 0.7),
          0 0 30px rgba(201, 184, 150, 0.5),
          0 3px 6px rgba(0, 0, 0, 0.25)
        `,
                lineHeight: '1.3',
                minHeight: '120px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-end',
                position: 'relative',
                overflow: 'hidden',
                wordWrap: 'break-word',
                overflowWrap: 'break-word',
                wordBreak: 'break-all'
            }}
        >
            <motion.div
                animate={{ x: ['-200%', '200%'] }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.12), transparent)',
                    pointerEvents: 'none'
                }}
            />

            <span style={{
                position: 'relative',
                zIndex: 1,
                display: 'block',
                width: '100%'
            }}>
                {fullExpression}
            </span>
        </motion.div>
    );
}
