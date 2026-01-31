import { useState, useMemo, useCallback } from 'react';
import { getDurationMinutes } from '../services/amadeus';

const initialFilters = {
    priceRange: [0, 10000],
    stops: [],
    airlines: [],
    departureTime: [],
    durationMax: null,
};

export function useFilters(flights) {
    const [filters, setFilters] = useState(initialFilters);

    const priceRange = useMemo(() => {
        if (!flights.length) return [0, 10000];
        const prices = flights.map(f => f.price.total);
        return [Math.floor(Math.min(...prices)), Math.ceil(Math.max(...prices))];
    }, [flights]);

    const availableAirlines = useMemo(() => {
        const airlineMap = new Map();
        flights.forEach(flight => {
            flight.airlines.forEach((code, idx) => {
                if (!airlineMap.has(code)) {
                    airlineMap.set(code, flight.airlineNames[idx] || code);
                }
            });
        });
        return Array.from(airlineMap.entries()).map(([code, name]) => ({ code, name }));
    }, [flights]);

    const stopsCounts = useMemo(() => {
        const counts = { 0: 0, 1: 0, 2: 0 };
        flights.forEach(flight => {
            const stops = flight.itineraries[0]?.stops || 0;
            if (stops === 0) counts[0]++;
            else if (stops === 1) counts[1]++;
            else counts[2]++;
        });
        return counts;
    }, [flights]);

    const filteredFlights = useMemo(() => {
        return flights.filter(flight => {
            if (filters.priceRange[0] > 0 || filters.priceRange[1] < priceRange[1]) {
                if (flight.price.total < filters.priceRange[0] || flight.price.total > filters.priceRange[1]) {
                    return false;
                }
            }

            if (filters.stops.length > 0) {
                const stops = flight.itineraries[0]?.stops || 0;
                const stopsCategory = stops >= 2 ? 2 : stops;
                if (!filters.stops.includes(stopsCategory)) {
                    return false;
                }
            }

            if (filters.airlines.length > 0) {
                const hasMatchingAirline = flight.airlines.some(code =>
                    filters.airlines.includes(code)
                );
                if (!hasMatchingAirline) {
                    return false;
                }
            }

            if (filters.departureTime.length > 0) {
                const departureHour = new Date(flight.itineraries[0]?.segments[0]?.departure.at).getHours();
                const timeSlot = getTimeSlot(departureHour);
                if (!filters.departureTime.includes(timeSlot)) {
                    return false;
                }
            }

            if (filters.durationMax) {
                const duration = getDurationMinutes(flight.itineraries[0]?.duration);
                if (duration > filters.durationMax) {
                    return false;
                }
            }

            return true;
        });
    }, [flights, filters, priceRange]);

    const setPriceRange = useCallback((range) => {
        setFilters(prev => ({ ...prev, priceRange: range }));
    }, []);

    const toggleStop = useCallback((stop) => {
        setFilters(prev => ({
            ...prev,
            stops: prev.stops.includes(stop)
                ? prev.stops.filter(s => s !== stop)
                : [...prev.stops, stop],
        }));
    }, []);

    const toggleAirline = useCallback((code) => {
        setFilters(prev => ({
            ...prev,
            airlines: prev.airlines.includes(code)
                ? prev.airlines.filter(c => c !== code)
                : [...prev.airlines, code],
        }));
    }, []);

    const toggleDepartureTime = useCallback((slot) => {
        setFilters(prev => ({
            ...prev,
            departureTime: prev.departureTime.includes(slot)
                ? prev.departureTime.filter(s => s !== slot)
                : [...prev.departureTime, slot],
        }));
    }, []);

    const setDurationMax = useCallback((max) => {
        setFilters(prev => ({ ...prev, durationMax: max }));
    }, []);

    const clearFilters = useCallback(() => {
        setFilters(initialFilters);
    }, []);

    const hasActiveFilters = useMemo(() => {
        return filters.stops.length > 0 ||
            filters.airlines.length > 0 ||
            filters.departureTime.length > 0 ||
            filters.durationMax !== null ||
            (filters.priceRange[0] > priceRange[0] || filters.priceRange[1] < priceRange[1]);
    }, [filters, priceRange]);

    return {
        filters,
        filteredFlights,
        priceRange,
        availableAirlines,
        stopsCounts,
        setPriceRange,
        toggleStop,
        toggleAirline,
        toggleDepartureTime,
        setDurationMax,
        clearFilters,
        hasActiveFilters,
    };
}

function getTimeSlot(hour) {
    if (hour >= 5 && hour < 12) return 'morning';
    if (hour >= 12 && hour < 17) return 'afternoon';
    if (hour >= 17 && hour < 21) return 'evening';
    return 'night';
}
