'use client';

export default function Header() {
    return (
        <header className="flex flex-col items-center px-2">
            <h1
                className="font-bold tracking-tight text-center text-glow"
                style={{
                    color: '#FFFFFF',
                    fontSize: 'clamp(24px, 6vw, 40px)',
                }}
            >
                🫧 Mathica
            </h1>
            <p
                className="text-center mt-1"
                style={{
                    color: 'rgba(255, 255, 255, 0.8)',
                    fontSize: 'clamp(12px, 3vw, 14px)',
                }}
            >
                Where Mathematics Meets Delight
            </p>
        </header>
    );
}
