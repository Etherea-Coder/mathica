export const operationColors = {
    add: '#4ECCA3',      // Bright mint - pops on dark
    subtract: '#FF6B9D', // Bright coral pink
    multiply: '#B794F6', // Bright lavender
    divide: '#63B3ED',   // Bright sky blue
} as const;

export type OperationType = keyof typeof operationColors;
