import { useState, useCallback } from 'react';
import { searchFlights } from '../services/amadeus';

export function useFlightSearch() {
    const [flights, setFlights] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [searchParams, setSearchParams] = useState(null);
    const [dictionaries, setDictionaries] = useState(null);

    const search = useCallback(async (params) => {
        setLoading(true);
        setError(null);
        setSearchParams(params);

        try {
            const result = await searchFlights(params);
            setFlights(result.flights);
            setDictionaries(result.dictionaries);
        } catch (err) {
            setError(err.message);
            setFlights([]);
        } finally {
            setLoading(false);
        }
    }, []);

    const clearResults = useCallback(() => {
        setFlights([]);
        setError(null);
        setSearchParams(null);
    }, []);

    return {
        flights,
        loading,
        error,
        searchParams,
        dictionaries,
        search,
        clearResults,
    };
}
