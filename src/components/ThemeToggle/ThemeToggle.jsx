import { useState, useEffect } from 'react';
import { Sun, Moon } from 'lucide-react';
import './ThemeToggle.css';

export function ThemeToggle() {
    const [theme, setTheme] = useState(() => {
        const saved = localStorage.getItem('theme');
        return saved || 'dark';
    });

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme(prev => prev === 'dark' ? 'light' : 'dark');
    };

    return (
        <button
            className="theme-toggle"
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
        >
            <div className="toggle-track">
                <Sun size={14} className="toggle-icon sun" />
                <Moon size={14} className="toggle-icon moon" />
                <div className={`toggle-thumb ${theme}`} />
            </div>
        </button>
    );
}
