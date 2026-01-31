import { useState, useEffect, useRef, useCallback } from 'react';
import { Search, MapPin, X } from 'lucide-react';
import { searchAirports } from '../../services/amadeus';
import './AirportAutocomplete.css';

export function AirportAutocomplete({
    value,
    onChange,
    placeholder,
    label,
    icon: Icon = MapPin
}) {
    const [query, setQuery] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [highlightIndex, setHighlightIndex] = useState(-1);
    const inputRef = useRef(null);
    const containerRef = useRef(null);
    const debounceRef = useRef(null);

    useEffect(() => {
        if (value) {
            setQuery(`${value.cityName} (${value.iataCode})`);
        } else {
            setQuery('');
        }
    }, [value]);

    const fetchSuggestions = useCallback(async (searchQuery) => {
        if (searchQuery.length < 2) {
            setSuggestions([]);
            return;
        }

        setLoading(true);
        try {
            const results = await searchAirports(searchQuery);
            setSuggestions(results);
            setHighlightIndex(-1);
        } catch (error) {
            console.error('Search error:', error);
            setSuggestions([]);
        } finally {
            setLoading(false);
        }
    }, []);

    const handleInputChange = (e) => {
        const newQuery = e.target.value;
        setQuery(newQuery);
        setIsOpen(true);

        if (debounceRef.current) {
            clearTimeout(debounceRef.current);
        }

        debounceRef.current = setTimeout(() => {
            fetchSuggestions(newQuery);
        }, 300);

        if (value) {
            onChange(null);
        }
    };

    const handleSelect = (airport) => {
        onChange(airport);
        setQuery(`${airport.cityName} (${airport.iataCode})`);
        setIsOpen(false);
        setSuggestions([]);
    };

    const handleClear = () => {
        setQuery('');
        onChange(null);
        setSuggestions([]);
        inputRef.current?.focus();
    };

    const handleKeyDown = (e) => {
        if (!isOpen || suggestions.length === 0) return;

        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                setHighlightIndex(prev =>
                    prev < suggestions.length - 1 ? prev + 1 : prev
                );
                break;
            case 'ArrowUp':
                e.preventDefault();
                setHighlightIndex(prev => prev > 0 ? prev - 1 : prev);
                break;
            case 'Enter':
                e.preventDefault();
                if (highlightIndex >= 0) {
                    handleSelect(suggestions[highlightIndex]);
                }
                break;
            case 'Escape':
                setIsOpen(false);
                break;
        }
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
        <div className="airport-autocomplete" ref={containerRef}>
            {label && <label className="autocomplete-label">{label}</label>}
            <div className="autocomplete-input-wrapper">
                <Icon className="autocomplete-icon" size={20} />
                <input
                    ref={inputRef}
                    type="text"
                    value={query}
                    onChange={handleInputChange}
                    onFocus={() => query.length >= 2 && setIsOpen(true)}
                    onKeyDown={handleKeyDown}
                    placeholder={placeholder}
                    className="autocomplete-input"
                    autoComplete="off"
                />
                {query && (
                    <button
                        type="button"
                        className="autocomplete-clear"
                        onClick={handleClear}
                        aria-label="Clear"
                    >
                        <X size={16} />
                    </button>
                )}
                {loading && <div className="autocomplete-spinner" />}
            </div>

            {isOpen && suggestions.length > 0 && (
                <ul className="autocomplete-dropdown">
                    {suggestions.map((airport, index) => (
                        <li
                            key={`${airport.iataCode}-${index}`}
                            className={`autocomplete-option ${index === highlightIndex ? 'highlighted' : ''}`}
                            onClick={() => handleSelect(airport)}
                            onMouseEnter={() => setHighlightIndex(index)}
                        >
                            <div className="option-icon">
                                {airport.type === 'AIRPORT' ? '✈️' : '🏙️'}
                            </div>
                            <div className="option-details">
                                <span className="option-name">{airport.name}</span>
                                <span className="option-location">
                                    {airport.cityName}, {airport.countryCode}
                                </span>
                            </div>
                            <span className="option-code">{airport.iataCode}</span>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
