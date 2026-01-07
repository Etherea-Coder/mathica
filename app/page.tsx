'use client';

import MajesticBubbles from '@/components/MajesticBubbles';
import SwipeBar from '@/components/SwipeBar';
import DisplayCard from '@/components/DisplayCard';
import CalculatorButton from '@/components/CalculatorButton';
import AffiliateBubble, { affiliateOffers, AffiliateOffer } from '@/components/AffiliateBubble';
import DownloadButton from '@/components/DownloadButton';
import { useCalculatorStore } from '@/store/calculatorStore';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

export default function Home() {
    const addInput = useCalculatorStore((state) => state.addInput);
    const setOperation = useCalculatorStore((state) => state.setOperation);
    const clear = useCalculatorStore((state) => state.clear);
    const backspace = useCalculatorStore((state) => state.backspace);
    const toggleSign = useCalculatorStore((state) => state.toggleSign);
    const percentage = useCalculatorStore((state) => state.percentage);
    const calculationCount = useCalculatorStore((state) => state.calculationCount);

    const [showBubble, setShowBubble] = useState(false);
    const [currentOffer, setCurrentOffer] = useState<AffiliateOffer | null>(null);

    useEffect(() => {
        if (calculationCount > 0 && calculationCount % 3 === 0) {
            const randomOffer = affiliateOffers[Math.floor(Math.random() * affiliateOffers.length)];
            setCurrentOffer(randomOffer);
            setShowBubble(true);

            // Auto-dismiss after 15 seconds
            const timer = setTimeout(() => {
                setShowBubble(false);
            }, 15000);
            return () => clearTimeout(timer);
        }
    }, [calculationCount]);

    const handleOperation = (op: 'add' | 'subtract' | 'multiply' | 'divide') => {
        setOperation(op);
    };

    return (
        <main className="relative min-h-screen overflow-hidden">
            {/* Majestic Bubbly Background */}
            <MajesticBubbles />

            {/* Main content - centered */}
            <div className="relative z-10 min-h-screen flex flex-col items-center justify-start px-4 md:px-8 py-8 md:py-12">

                {/* Header Title */}
                <motion.div
                    initial={{ opacity: 0, y: -50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, type: "spring" }}
                    className="text-center mb-8 mt-4"
                >
                    <h1 className="font-exo font-bold text-4xl md:text-5xl text-[#c9b896] drop-shadow-[0_3px_15px_rgba(201,184,150,0.4)] mb-2">
                        <span style={{ filter: 'sepia(1) saturate(2) hue-rotate(5deg)' }}>🫧</span> Mathica
                    </h1>
                    <p className="text-[#c9b896]/75 text-lg font-exo font-medium">
                        Where Mathematics Meets Delight
                    </p>
                </motion.div>

                {/* Calculator layout container */}
                <div className="w-full max-w-md relative">

                    {/* Display bar with calculation expression */}
                    <DisplayCard />

                    {/* Majestic Swipe Bar (overlaid on or near display) */}
                    <SwipeBar />

                    {/* Calculator Grid - 5 Rows x 4 Cols */}
                    <div className="grid grid-cols-4 gap-4 sm:gap-6 md:gap-8 w-full mt-12 pb-12">
                        {/* Row 1: C, %, ( ), +/- */}
                        <CalculatorButton value="C" onClick={clear} buttonType="utility" />
                        <CalculatorButton value="%" onClick={percentage} buttonType="utility" />
                        <CalculatorButton value="( )" onClick={() => { }} buttonType="utility" />
                        <CalculatorButton value="+/-" onClick={toggleSign} buttonType="utility" />

                        {/* Row 2: 7, 8, 9, ÷ */}
                        <CalculatorButton value="7" onClick={() => addInput('7')} buttonType="number" />
                        <CalculatorButton value="8" onClick={() => addInput('8')} buttonType="number" />
                        <CalculatorButton value="9" onClick={() => addInput('9')} buttonType="number" />
                        <CalculatorButton value="÷" onClick={() => handleOperation('divide')} buttonType="operator" />

                        {/* Row 3: 4, 5, 6, × */}
                        <CalculatorButton value="4" onClick={() => addInput('4')} buttonType="number" />
                        <CalculatorButton value="5" onClick={() => addInput('5')} buttonType="number" />
                        <CalculatorButton value="6" onClick={() => addInput('6')} buttonType="number" />
                        <CalculatorButton value="×" onClick={() => handleOperation('multiply')} buttonType="operator" />

                        {/* Row 4: 1, 2, 3, - */}
                        <CalculatorButton value="1" onClick={() => addInput('1')} buttonType="number" />
                        <CalculatorButton value="2" onClick={() => addInput('2')} buttonType="number" />
                        <CalculatorButton value="3" onClick={() => addInput('3')} buttonType="number" />
                        <CalculatorButton value="-" onClick={() => handleOperation('subtract')} buttonType="operator" />

                        {/* Row 5: 0, ., ⌫, + */}
                        <CalculatorButton value="0" onClick={() => addInput('0')} buttonType="number" />
                        <CalculatorButton value="." onClick={() => addInput('.')} buttonType="number" />
                        <CalculatorButton value="⌫" onClick={backspace} buttonType="utility" />
                        <CalculatorButton value="+" onClick={() => handleOperation('add')} buttonType="operator" />
                    </div>

                    <div className="flex justify-center mt-4">
                        <DownloadButton />
                    </div>
                </div>
            </div>

            <AffiliateBubble
                isVisible={showBubble}
                onClose={() => setShowBubble(false)}
                offer={currentOffer}
            />
        </main>
    );
}
