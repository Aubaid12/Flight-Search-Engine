import { useState, useRef, useEffect } from 'react';
import { Users, ChevronDown } from 'lucide-react';
import './PassengerSelector.css';

export function PassengerSelector({ value, onChange }) {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef(null);

    const { adults = 1, children = 0, infants = 0 } = value;
    const total = adults + children + infants;

    const handleChange = (type, delta) => {
        const newValue = { ...value };
        newValue[type] = Math.max(0, (newValue[type] || 0) + delta);

        if (type === 'adults') {
            newValue.adults = Math.max(1, newValue.adults);
            if (newValue.infants > newValue.adults) {
                newValue.infants = newValue.adults;
            }
        }

        if (type === 'infants' && newValue.infants > newValue.adults) {
            return;
        }

        const totalPassengers = newValue.adults + newValue.children + newValue.infants;
        if (totalPassengers > 9) return;

        onChange(newValue);
    };

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (containerRef.current && !containerRef.current.contains(e.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="passenger-selector" ref={containerRef}>
            <label className="passenger-label">Travelers</label>
            <button
                type="button"
                className="passenger-trigger"
                onClick={() => setIsOpen(!isOpen)}
            >
                <Users size={20} className="passenger-icon" />
                <span className="passenger-text">
                    {total} {total === 1 ? 'Traveler' : 'Travelers'}
                </span>
                <ChevronDown
                    size={18}
                    className={`passenger-chevron ${isOpen ? 'open' : ''}`}
                />
            </button>

            {isOpen && (
                <div className="passenger-dropdown">
                    <PassengerRow
                        label="Adults"
                        sublabel="Age 12+"
                        value={adults}
                        onDecrease={() => handleChange('adults', -1)}
                        onIncrease={() => handleChange('adults', 1)}
                        min={1}
                    />
                    <PassengerRow
                        label="Children"
                        sublabel="Age 2-11"
                        value={children}
                        onDecrease={() => handleChange('children', -1)}
                        onIncrease={() => handleChange('children', 1)}
                        min={0}
                    />
                    <PassengerRow
                        label="Infants"
                        sublabel="Under 2"
                        value={infants}
                        onDecrease={() => handleChange('infants', -1)}
                        onIncrease={() => handleChange('infants', 1)}
                        min={0}
                        max={adults}
                    />
                    <button
                        type="button"
                        className="passenger-done"
                        onClick={() => setIsOpen(false)}
                    >
                        Done
                    </button>
                </div>
            )}
        </div>
    );
}

function PassengerRow({ label, sublabel, value, onDecrease, onIncrease, min = 0, max = 9 }) {
    return (
        <div className="passenger-row">
            <div className="passenger-info">
                <span className="passenger-type">{label}</span>
                <span className="passenger-sublabel">{sublabel}</span>
            </div>
            <div className="passenger-controls">
                <button
                    type="button"
                    className="passenger-btn"
                    onClick={onDecrease}
                    disabled={value <= min}
                >
                    −
                </button>
                <span className="passenger-count">{value}</span>
                <button
                    type="button"
                    className="passenger-btn"
                    onClick={onIncrease}
                    disabled={value >= max}
                >
                    +
                </button>
            </div>
        </div>
    );
}
