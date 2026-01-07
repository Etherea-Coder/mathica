import React, { useState, useEffect, useRef } from 'react';
import { motion, useMotionValue, PanInfo, useAnimation } from 'framer-motion';

// Store implementation
const createStore = (initialState) => {
  let state = initialState;
  const listeners = new Set();
  
  const getState = () => state;
  const setState = (partial) => {
    state = { ...state, ...partial };
    listeners.forEach(listener => listener(state));
  };
  
  const subscribe = (listener) => {
    listeners.add(listener);
    return () => listeners.delete(listener);
  };
  
  return { getState, setState, subscribe };
};

const calculatorStore = createStore({
  display: '0',
  currentValue: '0',
  previousValue: null,
  operation: null,
});

const useCalculatorStore = (selector) => {
  const [state, setState] = useState(() => selector(calculatorStore.getState()));
  
  useEffect(() => {
    return calculatorStore.subscribe((newState) => {
      setState(selector(newState));
    });
  }, [selector]);
  
  return state;
};

const actions = {
  addInput: (value) => {
    const state = calculatorStore.getState();
    if (state.currentValue === '0' && value !== '.') {
      calculatorStore.setState({ currentValue: value, display: value });
    } else if (value === '.' && state.currentValue.includes('.')) {
      return;
    } else {
      const newValue = state.currentValue + value;
      calculatorStore.setState({ currentValue: newValue, display: newValue });
    }
  },
  
  setOperation: (op) => {
    const state = calculatorStore.getState();
    if (state.previousValue && state.operation) {
      actions.calculate();
    }
    calculatorStore.setState({
      previousValue: state.currentValue,
      operation: op,
      currentValue: '0'
    });
  },
  
  calculate: () => {
    const state = calculatorStore.getState();
    if (!state.previousValue || !state.operation) return;
    
    const prev = parseFloat(state.previousValue);
    const curr = parseFloat(state.currentValue);
    let result = 0;
    
    switch (state.operation) {
      case 'add': result = prev + curr; break;
      case 'subtract': result = prev - curr; break;
      case 'multiply': result = prev * curr; break;
      case 'divide': result = prev / curr; break;
    }
    
    const resultStr = result.toString();
    calculatorStore.setState({
      display: resultStr,
      currentValue: resultStr,
      previousValue: null,
      operation: null
    });
  },
  
  clear: () => {
    calculatorStore.setState({
      display: '0',
      currentValue: '0',
      previousValue: null,
      operation: null
    });
  },
  
  backspace: () => {
    const state = calculatorStore.getState();
    const newValue = state.currentValue.length > 1 
      ? state.currentValue.slice(0, -1) 
      : '0';
    calculatorStore.setState({ currentValue: newValue, display: newValue });
  },
  
  toggleSign: () => {
    const state = calculatorStore.getState();
    const num = parseFloat(state.currentValue) * -1;
    const newValue = num.toString();
    calculatorStore.setState({ currentValue: newValue, display: newValue });
  },
  
  percentage: () => {
    const state = calculatorStore.getState();
    const num = parseFloat(state.currentValue) / 100;
    const newValue = num.toString();
    calculatorStore.setState({ currentValue: newValue, display: newValue });
  }
};

// Rising Bubbles from bottom to top
const FloatingBubbles = () => {
  const [bubbles] = useState(() => 
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
};

// Floating Number Orbs
const FloatingNumber = ({ value, onClick, position, type = 'number' }) => {
  const [isHovered, setIsHovered] = useState(false);
  const controls = useAnimation();

  const getColor = () => {
    if (type === 'operator') {
      return {
        bg: 'linear-gradient(135deg, rgba(245, 245, 220, 0.95) 0%, rgba(235, 235, 210, 0.85) 100%)',
        text: '#4A4A3A',
        glow: 'rgba(245, 245, 220, 0.7)',
        shadow: '0 18px 50px rgba(200, 200, 150, 0.35)'
      };
    }
    if (type === 'utility') {
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
    
    if ('vibrate' in navigator) navigator.vibrate(15);
    onClick();
  };

  return (
    <motion.div
      animate={controls}
      style={{
        position: 'absolute',
        left: position.x,
        top: position.y,
        transform: 'translate(-50%, -50%)',
        cursor: 'pointer',
        perspective: '1000px',
        zIndex: 10
      }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      whileHover={{ 
        scale: 1.15,
        zIndex: 20,
        transition: { duration: 0.2 }
      }}
    >
      <motion.div
        onClick={handleInteraction}
        onTouchStart={(e) => { e.preventDefault(); handleInteraction(); }}
        animate={{
          y: [0, -10, 0],
        }}
        transition={{
          y: {
            duration: 3.5,
            repeat: Infinity,
            ease: "easeInOut"
          }
        }}
        style={{
          width: type === 'operator' ? '90px' : '80px',
          height: type === 'operator' ? '90px' : '80px',
          borderRadius: '50%',
          background: colors.bg,
          backdropFilter: 'blur(20px)',
          border: '2px solid rgba(250, 250, 235, 0.3)',
          boxShadow: `
            ${colors.shadow},
            inset 0 0 25px ${colors.glow},
            inset 15px 15px 30px rgba(255, 255, 255, 0.15),
            inset -15px -15px 30px rgba(0, 0, 0, 0.12)
          `,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: type === 'utility' ? '1.3rem' : '2rem',
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
        
        <span style={{ position: 'relative', zIndex: 1 }}>{value}</span>
        
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
      </motion.div>
    </motion.div>
  );
};

const FloatingKeypad = () => {
  const positions = {
    'C': { x: '20%', y: '15%' },
    '%': { x: '40%', y: '12%' },
    '( )': { x: '60%', y: '12%' },
    '+/-': { x: '80%', y: '15%' },
    
    '7': { x: '25%', y: '35%' },
    '8': { x: '50%', y: '32%' },
    '9': { x: '75%', y: '35%' },
    
    '4': { x: '20%', y: '55%' },
    '5': { x: '50%', y: '52%' },
    '6': { x: '80%', y: '55%' },
    
    '1': { x: '25%', y: '75%' },
    '2': { x: '50%', y: '72%' },
    '3': { x: '75%', y: '75%' },
    
    '0': { x: '30%', y: '92%' },
    '.': { x: '50%', y: '90%' },
    '⌫': { x: '70%', y: '92%' },
    
    '÷': { x: '92%', y: '28%' },
    '×': { x: '94%', y: '48%' },
    '-': { x: '92%', y: '68%' },
    '+': { x: '90%', y: '85%' },
  };

  const buttons = [
    { value: 'C', action: actions.clear, type: 'utility' },
    { value: '%', action: actions.percentage, type: 'utility' },
    { value: '( )', action: () => {}, type: 'utility' },
    { value: '+/-', action: actions.toggleSign, type: 'utility' },
    
    { value: '7', action: () => actions.addInput('7'), type: 'number' },
    { value: '8', action: () => actions.addInput('8'), type: 'number' },
    { value: '9', action: () => actions.addInput('9'), type: 'number' },
    { value: '÷', action: () => actions.setOperation('divide'), type: 'operator' },
    
    { value: '4', action: () => actions.addInput('4'), type: 'number' },
    { value: '5', action: () => actions.addInput('5'), type: 'number' },
    { value: '6', action: () => actions.addInput('6'), type: 'number' },
    { value: '×', action: () => actions.setOperation('multiply'), type: 'operator' },
    
    { value: '1', action: () => actions.addInput('1'), type: 'number' },
    { value: '2', action: () => actions.addInput('2'), type: 'number' },
    { value: '3', action: () => actions.addInput('3'), type: 'number' },
    { value: '-', action: () => actions.setOperation('subtract'), type: 'operator' },
    
    { value: '0', action: () => actions.addInput('0'), type: 'number' },
    { value: '.', action: () => actions.addInput('.'), type: 'number' },
    { value: '⌫', action: actions.backspace, type: 'utility' },
    { value: '+', action: () => actions.setOperation('add'), type: 'operator' },
  ];

  return (
    <div style={{
      position: 'relative',
      width: '100%',
      height: '600px',
      maxWidth: '500px',
    }}>
      {buttons.map((btn) => (
        <FloatingNumber
          key={btn.value}
          value={btn.value}
          onClick={btn.action}
          position={positions[btn.value]}
          type={btn.type}
        />
      ))}
    </div>
  );
};

// Display with truly responsive text that wraps
const MajesticDisplay = () => {
  const display = useCalculatorStore(state => state.display);
  const previousValue = useCalculatorStore(state => state.previousValue);
  const operation = useCalculatorStore(state => state.operation);
  const currentValue = useCalculatorStore(state => state.currentValue);

  const getOperatorSymbol = (op) => {
    const symbols = { add: '+', subtract: '-', multiply: '×', divide: '÷' };
    return symbols[op] || '';
  };

  let fullExpression = display || '0';
  if (previousValue && operation) {
    fullExpression = currentValue === '0'
      ? `${previousValue} ${getOperatorSymbol(operation)}`
      : `${previousValue} ${getOperatorSymbol(operation)} ${currentValue}`;
  }

  // Responsive font size based on expression length - gets smaller as needed
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
      className="display-bar"
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
        color: '#D2B48C',
        textShadow: `
          0 0 15px rgba(210, 180, 140, 0.7),
          0 0 30px rgba(210, 180, 140, 0.5),
          0 3px 6px rgba(0, 0, 0, 0.25)
        `,
        lineHeight: '1.3',
        minHeight: '90px',
        maxHeight: '180px',
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
};

// Vertical Swipe Bar - Swipes LEFT to RIGHT like Tinder!
const VerticalSwipeBar = () => {
  const x = useMotionValue(0);
  const [isDragging, setIsDragging] = useState(false);
  const [progress, setProgress] = useState(0);
  const [displayBarRect, setDisplayBarRect] = useState({ top: 0, left: 0 });

  useEffect(() => {
    // Get the display bar position
    const updatePosition = () => {
      const displayBar = document.querySelector('.display-bar');
      if (displayBar) {
        const rect = displayBar.getBoundingClientRect();
        setDisplayBarRect({ 
          top: rect.top + rect.height / 2, 
          left: rect.left - 60 // Start 60px to the left of the display bar
        });
      }
    };
    
    updatePosition();
    window.addEventListener('resize', updatePosition);
    window.addEventListener('scroll', updatePosition);
    
    return () => {
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition);
    };
  }, []);

  useEffect(() => {
    const unsubscribe = x.onChange(latest => {
      const maxDrag = 350;
      setProgress(Math.min(Math.max(latest / maxDrag, 0), 1));
    });
    return unsubscribe;
  }, [x]);

  const handleDragEnd = () => {
    setIsDragging(false);
    if (progress >= 0.75) {
      if ('vibrate' in navigator) navigator.vibrate([30, 10, 30]);
      actions.calculate();
    }
    x.set(0);
    setProgress(0);
  };

  return (
    <div style={{
      position: 'fixed',
      left: displayBarRect.left,
      top: displayBarRect.top,
      transform: 'translateY(-50%)',
      zIndex: 100,
      pointerEvents: 'none'
    }}>
      {/* Horizontal track (vertical bar appearance) */}
      <div style={{
        position: 'relative',
        width: '400px',
        height: '6px',
        background: 'linear-gradient(90deg, rgba(245, 245, 220, 0.18) 0%, rgba(245, 245, 220, 0.28) 100%)',
        backdropFilter: 'blur(15px)',
        borderRadius: '3px',
        boxShadow: '0 0 20px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.15)',
        border: '1px solid rgba(250, 250, 235, 0.25)'
      }}>
        {/* Progress fill */}
        <motion.div
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            bottom: 0,
            width: `${progress * 100}%`,
            background: `linear-gradient(90deg, 
              rgba(210, 180, 140, 0.4) 0%, 
              rgba(210, 180, 140, 0.65) 50%, 
              rgba(220, 190, 150, 0.85) 100%)`,
            borderRadius: '3px',
            boxShadow: '0 0 25px rgba(210, 180, 140, 0.5)',
            transition: 'width 0.1s ease-out'
          }}
        />

        {/* Draggable handle */}
        <motion.div
          style={{
            position: 'absolute',
            left: 0,
            top: '50%',
            x,
            y: '-50%',
            width: '90px',
            height: '90px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, rgba(245, 245, 220, 0.98) 0%, rgba(240, 240, 215, 0.92) 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '2.5rem',
            fontWeight: '700',
            color: '#8B7355',
            cursor: 'grab',
            boxShadow: `
              0 10px 35px rgba(210, 180, 140, ${isDragging ? 0.7 : 0.4}),
              0 0 ${isDragging ? 50 : 25}px rgba(210, 180, 140, 0.5),
              inset 0 2px 4px rgba(255, 255, 255, 0.4)
            `,
            border: '3px solid rgba(210, 180, 140, 0.5)',
            pointerEvents: 'auto'
          }}
          drag="x"
          dragConstraints={{ left: 0, right: 350 }}
          dragElastic={0.05}
          onDragStart={() => setIsDragging(true)}
          onDragEnd={handleDragEnd}
          whileHover={{ scale: 1.1 }}
          whileDrag={{ 
            cursor: 'grabbing', 
            scale: 1.15,
          }}
        >
          <motion.span
            animate={{ rotate: isDragging ? [0, 360] : 0 }}
            transition={{ duration: 2, repeat: isDragging ? Infinity : 0, ease: "linear" }}
          >
            =
          </motion.span>

          {isDragging && (
            <motion.div
              style={{
                position: 'absolute',
                inset: -20,
                borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(210, 180, 140, 0.5), transparent 70%)',
                filter: 'blur(15px)',
                pointerEvents: 'none'
              }}
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.5, 0.25, 0.5]
              }}
              transition={{ duration: 0.8, repeat: Infinity }}
            />
          )}
        </motion.div>

        {/* Hint text */}
        <motion.div
          style={{
            position: 'absolute',
            left: '110px',
            top: '50%',
            transform: 'translateY(-50%)',
            color: 'rgba(245, 245, 220, 0.85)',
            fontSize: '1rem',
            fontWeight: '600',
            fontFamily: "'Exo 2', sans-serif",
            whiteSpace: 'nowrap',
            opacity: isDragging ? 0.2 : 0.9,
            transition: 'opacity 0.3s',
            textShadow: '0 2px 8px rgba(0, 0, 0, 0.3)',
            pointerEvents: 'none'
          }}
        >
          {progress > 0.5 ? '→ Release!' : '→ Slide right'}
        </motion.div>
      </div>
    </div>
  );
};

// Main App
export default function CalculatorTheater() {
  return (
    <div style={{
      minHeight: '100vh',
      background: '#3a3a3a url(/chalkboard-bg.jpg) center/cover fixed',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <FloatingBubbles />
      <VerticalSwipeBar />
      
      <div style={{
        position: 'relative',
        zIndex: 10,
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
        padding: '2rem 1rem'
      }}>
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, type: "spring" }}
          style={{
            textAlign: 'center',
            marginBottom: '2rem',
            marginTop: '1rem'
          }}
        >
          <h1 style={{
            fontFamily: "'Exo 2', sans-serif",
            fontSize: 'clamp(1.8rem, 6vw, 3rem)',
            fontWeight: '700',
            color: '#F5F5DC',
            textShadow: '0 3px 15px rgba(245, 245, 220, 0.4), 0 0 40px rgba(245, 245, 220, 0.25)',
            marginBottom: '0.5rem'
          }}>
            🫧 Mathica
          </h1>
          <p style={{
            color: 'rgba(245, 245, 220, 0.75)',
            fontSize: 'clamp(0.9rem, 2.5vw, 1.1rem)',
            fontFamily: "'Exo 2', sans-serif",
            fontWeight: '500'
          }}>
            Where Mathematics Meets Delight
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          style={{ width: '100%', maxWidth: '500px' }}
        >
          <MajesticDisplay />
          <FloatingKeypad />
        </motion.div>
      </div>
    </div>
  );
}