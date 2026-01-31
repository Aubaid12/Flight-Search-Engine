import { useState } from 'react';
import { Circle, CircleCheck, ChevronDown } from 'lucide-react';
import './AirlineFilter.css';

export function AirlineFilter({ airlines, selected, onToggle }) {
    const [expanded, setExpanded] = useState(false);

    const displayAirlines = expanded ? airlines : airlines.slice(0, 5);
    const hasMore = airlines.length > 5;

    if (airlines.length === 0) {
        return null;
    }

    return (
        <div className="filter-section airline-filter">
            <h3 className="filter-section-title">Airlines</h3>

            <div className="airline-options">
                {displayAirlines.map(airline => {
                    const isSelected = selected.includes(airline.code);

                    return (
                        <button
                            key={airline.code}
                            className={`airline-option ${isSelected ? 'selected' : ''}`}
                            onClick={() => onToggle(airline.code)}
                        >
                            {isSelected ? (
                                <CircleCheck size={18} className="option-icon checked" />
                            ) : (
                                <Circle size={18} className="option-icon" />
                            )}
                            <span className="option-label">{airline.name}</span>
                            <span className="airline-code">{airline.code}</span>
                        </button>
                    );
                })}

                {hasMore && (
                    <button
                        className="show-more-btn"
                        onClick={() => setExpanded(!expanded)}
                    >
                        <ChevronDown
                            size={16}
                            className={expanded ? 'rotated' : ''}
                        />
                        {expanded ? 'Show less' : `Show ${airlines.length - 5} more`}
                    </button>
                )}
            </div>
        </div>
    );
}
