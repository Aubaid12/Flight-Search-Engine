import { useState, useRef, useEffect } from 'react';
import { Armchair, ChevronDown } from 'lucide-react';
import './CabinClassSelector.css';

const CABIN_CLASSES = [
    { value: 'ECONOMY', label: 'Economy' },
    { value: 'PREMIUM_ECONOMY', label: 'Premium Economy' },
    { value: 'BUSINESS', label: 'Business' },
    { value: 'FIRST', label: 'First Class' },
];

export function CabinClassSelector({ value, onChange }) {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef(null);

    const selectedClass = CABIN_CLASSES.find(c => c.value === value) || CABIN_CLASSES[0];

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (containerRef.current && !containerRef.current.contains(e.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSelect = (cabinClass) => {
        onChange(cabinClass.value);
        setIsOpen(false);
    };

    return (
        <div className="cabin-selector" ref={containerRef}>
            <label className="cabin-label">Class</label>
            <button
                type="button"
                className="cabin-trigger"
                onClick={() => setIsOpen(!isOpen)}
            >
                <Armchair size={20} className="cabin-icon" />
                <span className="cabin-text">{selectedClass.label}</span>
                <ChevronDown
                    size={18}
                    className={`cabin-chevron ${isOpen ? 'open' : ''}`}
                />
            </button>

            {isOpen && (
                <ul className="cabin-dropdown">
                    {CABIN_CLASSES.map((cabinClass) => (
                        <li
                            key={cabinClass.value}
                            className={`cabin-option ${cabinClass.value === value ? 'selected' : ''}`}
                            onClick={() => handleSelect(cabinClass)}
                        >
                            {cabinClass.label}
                            {cabinClass.value === value && <span className="cabin-check">✓</span>}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
