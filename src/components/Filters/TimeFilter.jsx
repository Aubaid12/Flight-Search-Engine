import { Sunrise, Sun, Sunset, Moon } from 'lucide-react';
import './TimeFilter.css';

const TIME_SLOTS = [
    { value: 'morning', label: 'Morning', sublabel: '5am - 12pm', Icon: Sunrise },
    { value: 'afternoon', label: 'Afternoon', sublabel: '12pm - 5pm', Icon: Sun },
    { value: 'evening', label: 'Evening', sublabel: '5pm - 9pm', Icon: Sunset },
    { value: 'night', label: 'Night', sublabel: '9pm - 5am', Icon: Moon },
];

export function TimeFilter({ selected, onToggle }) {
    return (
        <div className="filter-section time-filter">
            <h3 className="filter-section-title">Departure Time</h3>

            <div className="time-options">
                {TIME_SLOTS.map(slot => {
                    const isSelected = selected.includes(slot.value);
                    const Icon = slot.Icon;

                    return (
                        <button
                            key={slot.value}
                            className={`time-option ${isSelected ? 'selected' : ''}`}
                            onClick={() => onToggle(slot.value)}
                        >
                            <Icon size={20} className="time-icon" />
                            <span className="time-label">{slot.label}</span>
                            <span className="time-sublabel">{slot.sublabel}</span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
