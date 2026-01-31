import { Circle, CircleCheck } from 'lucide-react';
import './StopsFilter.css';

const STOPS_OPTIONS = [
    { value: 0, label: 'Nonstop' },
    { value: 1, label: '1 Stop' },
    { value: 2, label: '2+ Stops' },
];

export function StopsFilter({ selected, counts, onToggle }) {
    return (
        <div className="filter-section stops-filter">
            <h3 className="filter-section-title">Stops</h3>

            <div className="stops-options">
                {STOPS_OPTIONS.map(option => {
                    const isSelected = selected.includes(option.value);
                    const count = counts[option.value] || 0;

                    return (
                        <button
                            key={option.value}
                            className={`stops-option ${isSelected ? 'selected' : ''}`}
                            onClick={() => onToggle(option.value)}
                            disabled={count === 0}
                        >
                            {isSelected ? (
                                <CircleCheck size={18} className="option-icon checked" />
                            ) : (
                                <Circle size={18} className="option-icon" />
                            )}
                            <span className="option-label">{option.label}</span>
                            <span className="option-count">({count})</span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
