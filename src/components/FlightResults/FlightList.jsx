import { useState, useMemo } from 'react';
import { ArrowUpDown, Plane, Loader } from 'lucide-react';
import { FlightCard } from './FlightCard';
import { getDurationMinutes } from '../../services/amadeus';
import './FlightList.css';

const SORT_OPTIONS = [
    { value: 'price-asc', label: 'Price: Low to High' },
    { value: 'price-desc', label: 'Price: High to Low' },
    { value: 'duration-asc', label: 'Duration: Shortest' },
    { value: 'duration-desc', label: 'Duration: Longest' },
    { value: 'departure-asc', label: 'Departure: Earliest' },
    { value: 'departure-desc', label: 'Departure: Latest' },
];

export function FlightList({ flights, loading, error, searchParams }) {
    const [sortBy, setSortBy] = useState('price-asc');

    const sortedFlights = useMemo(() => {
        if (!flights.length) return [];

        return [...flights].sort((a, b) => {
            switch (sortBy) {
                case 'price-asc':
                    return a.price.total - b.price.total;
                case 'price-desc':
                    return b.price.total - a.price.total;
                case 'duration-asc':
                    return getDurationMinutes(a.itineraries[0]?.duration) -
                        getDurationMinutes(b.itineraries[0]?.duration);
                case 'duration-desc':
                    return getDurationMinutes(b.itineraries[0]?.duration) -
                        getDurationMinutes(a.itineraries[0]?.duration);
                case 'departure-asc':
                    return new Date(a.itineraries[0]?.segments[0]?.departure.at) -
                        new Date(b.itineraries[0]?.segments[0]?.departure.at);
                case 'departure-desc':
                    return new Date(b.itineraries[0]?.segments[0]?.departure.at) -
                        new Date(a.itineraries[0]?.segments[0]?.departure.at);
                default:
                    return 0;
            }
        });
    }, [flights, sortBy]);

    if (loading) {
        return (
            <div className="flight-list-state">
                <Loader size={48} className="spinner" />
                <h3>Searching flights...</h3>
                <p>Finding the best deals for you</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flight-list-state error">
                <div className="state-icon error">!</div>
                <h3>Oops! Something went wrong</h3>
                <p>{error}</p>
            </div>
        );
    }

    if (!searchParams) {
        return (
            <div className="flight-list-state empty">
                <Plane size={64} className="state-icon-plane" />
                <h3>Ready to explore?</h3>
                <p>Search for flights to see available options</p>
            </div>
        );
    }

    if (flights.length === 0) {
        return (
            <div className="flight-list-state empty">
                <div className="state-icon">✈️</div>
                <h3>No flights found</h3>
                <p>
                    We couldn't find any flights
                    {searchParams ? (
                        <> from <strong>{searchParams.origin}</strong> to <strong>{searchParams.destination}</strong></>
                    ) : ' matching your criteria'}
                </p>
                <p className="empty-suggestion">Try adjusting your dates or checking nearby airports.</p>
            </div>
        );
    }

    return (
        <div className="flight-list">
            <div className="flight-list-header">
                <div className="results-count">
                    <span className="count">{sortedFlights.length}</span>
                    {' '}flight{sortedFlights.length !== 1 ? 's' : ''} found
                </div>

                <div className="sort-control">
                    <ArrowUpDown size={16} />
                    <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="sort-select"
                    >
                        {SORT_OPTIONS.map(option => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="flight-list-items">
                {sortedFlights.map((flight, index) => (
                    <FlightCard
                        key={flight.id}
                        flight={flight}
                        style={{ animationDelay: `${index * 50}ms` }}
                    />
                ))}
            </div>
        </div>
    );
}
