import { create } from 'zustand';

interface CalculatorState {
    display: string;
    currentValue: string;
    previousValue: string;
    operation: string | null;
    history: CalculationHistory[];
    shouldResetOnNextInput: boolean;
    calculationCount: number;
    addInput: (value: string) => void;
    setOperation: (op: string) => void;
    calculate: () => void;
    clear: () => void;
    backspace: () => void;
    toggleSign: () => void;
    percentage: () => void;
}

export interface CalculationHistory {
    id: string;
    expression: string;
    result: string;
    operation: 'add' | 'subtract' | 'multiply' | 'divide';
    timestamp: number;
}

export const useCalculatorStore = create<CalculatorState>((set, get) => ({
    display: '0',
    currentValue: '0',
    previousValue: '',
    operation: null,
    history: [],
    shouldResetOnNextInput: false,
    calculationCount: 0,

    addInput: (value: string) => {
        const { currentValue, shouldResetOnNextInput } = get();

        // If we just finished a calculation, reset and start fresh
        if (shouldResetOnNextInput) {
            set({
                currentValue: value === '.' ? '0.' : value,
                display: value === '.' ? '0.' : value,
                previousValue: '',
                operation: null,
                shouldResetOnNextInput: false,
            });
            return;
        }

        // Handle decimal point
        if (value === '.' && currentValue.includes('.')) return;

        // Start new number or append
        const newValue = currentValue === '0' && value !== '.'
            ? value
            : currentValue + value;

        set({
            currentValue: newValue,
            display: newValue
        });
    },

    setOperation: (op: string) => {
        const { currentValue, previousValue, operation, shouldResetOnNextInput } = get();

        // If we just finished a calculation and click an operation, start fresh with 0
        if (shouldResetOnNextInput) {
            set({
                previousValue: '0',
                currentValue: '0',
                operation: op,
                display: '0',
                shouldResetOnNextInput: false,
            });
            return;
        }

        // If there's a previous operation, calculate first
        if (previousValue && operation) {
            get().calculate();
            // After calculate, previousValue and operation are cleared,
            // and display/currentValue hold the result.
            // Now we set the new operation using that result.
            const updatedState = get();
            set({
                previousValue: updatedState.currentValue,
                currentValue: '0',
                operation: op,
                display: updatedState.currentValue,
                shouldResetOnNextInput: false,
            });
            return;
        }

        set({
            previousValue: currentValue,
            currentValue: '0',
            operation: op,
            display: currentValue,
            shouldResetOnNextInput: false,
        });
    },

    calculate: () => {
        const { currentValue, previousValue, operation } = get();

        if (!operation || !previousValue) return;

        const prev = parseFloat(previousValue);
        const curr = parseFloat(currentValue);
        let result = 0;

        switch (operation) {
            case 'add':
                result = prev + curr;
                break;
            case 'subtract':
                result = prev - curr;
                break;
            case 'multiply':
                result = prev * curr;
                break;
            case 'divide':
                result = curr !== 0 ? prev / curr : 0;
                break;
        }

        const resultStr = result.toString();
        const expression = `${previousValue} ${getOperatorSymbol(operation)} ${currentValue}`;

        // Add to history
        const historyItem: CalculationHistory = {
            id: Date.now().toString(),
            expression,
            result: resultStr,
            operation: operation as any,
            timestamp: Date.now(),
        };

        set({
            display: resultStr,
            currentValue: resultStr,
            previousValue: '',
            operation: null,
            history: [...get().history, historyItem],
            shouldResetOnNextInput: true,
            calculationCount: get().calculationCount + 1,
        });
    },

    clear: () => {
        set({
            display: '0',
            currentValue: '0',
            previousValue: '',
            operation: null,
            shouldResetOnNextInput: false,
        });
    },

    backspace: () => {
        const { currentValue } = get();
        if (currentValue.length <= 1) {
            set({ currentValue: '0', display: '0' });
        } else {
            const newValue = currentValue.slice(0, -1);
            set({ currentValue: newValue, display: newValue });
        }
    },

    toggleSign: () => {
        const { currentValue } = get();
        const num = parseFloat(currentValue);
        const newValue = (num * -1).toString();
        set({ currentValue: newValue, display: newValue });
    },

    percentage: () => {
        const { currentValue } = get();
        const num = parseFloat(currentValue);
        const newValue = (num / 100).toString();
        set({ currentValue: newValue, display: newValue });
    },
}));

function getOperatorSymbol(operation: string): string {
    switch (operation) {
        case 'add': return '+';
        case 'subtract': return '−';
        case 'multiply': return '×';
        case 'divide': return '÷';
        default: return '';
    }
}
