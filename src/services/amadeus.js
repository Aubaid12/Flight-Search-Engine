const API_BASE = 'https://test.api.amadeus.com';
let cachedToken = null;
let tokenExpiry = null;

async function getAccessToken() {
    if (cachedToken && tokenExpiry && Date.now() < tokenExpiry) {
        return cachedToken;
    }

    const apiKey = import.meta.env.VITE_AMADEUS_API_KEY;
    const apiSecret = import.meta.env.VITE_AMADEUS_API_SECRET;

    if (!apiKey || !apiSecret) {
        throw new Error('Amadeus API credentials not configured. Please add VITE_AMADEUS_API_KEY and VITE_AMADEUS_API_SECRET to your .env file.');
    }

    const response = await fetch(`${API_BASE}/v1/security/oauth2/token`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
            grant_type: 'client_credentials',
            client_id: apiKey,
            client_secret: apiSecret,
        }),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error_description || 'Failed to authenticate with Amadeus API');
    }

    const data = await response.json();
    cachedToken = data.access_token;
    tokenExpiry = Date.now() + (data.expires_in - 60) * 1000;

    return cachedToken;
}

async function apiRequest(endpoint, options = {}) {
    const token = await getAccessToken();

    const response = await fetch(`${API_BASE}${endpoint}`, {
        ...options,
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            ...options.headers,
        },
    });

    if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.errors?.[0]?.detail || `API request failed: ${response.status}`);
    }

    return response.json();
}

export async function searchAirports(keyword) {
    if (!keyword || keyword.length < 2) {
        return [];
    }

    try {
        const data = await apiRequest(
            `/v1/reference-data/locations?subType=AIRPORT,CITY&keyword=${encodeURIComponent(keyword)}&page[limit]=10`
        );

        return data.data.map(location => ({
            iataCode: location.iataCode,
            name: location.name,
            cityName: location.address?.cityName || location.name,
            countryCode: location.address?.countryCode,
            type: location.subType,
        }));
    } catch (error) {
        console.error('Airport search error:', error);
        return [];
    }
}

export async function searchFlights({
    origin,
    destination,
    departureDate,
    returnDate,
    adults = 1,
    children = 0,
    infants = 0,
    travelClass = 'ECONOMY',
    nonStop = false,
    maxResults = 50
}) {
    const params = new URLSearchParams({
        originLocationCode: origin,
        destinationLocationCode: destination,
        departureDate,
        adults: String(adults),
        currencyCode: 'USD',
        max: String(maxResults),
    });

    if (returnDate) {
        params.append('returnDate', returnDate);
    }
    if (children > 0) {
        params.append('children', String(children));
    }
    if (infants > 0) {
        params.append('infants', String(infants));
    }
    if (travelClass !== 'ECONOMY') {
        params.append('travelClass', travelClass);
    }
    if (nonStop) {
        params.append('nonStop', 'true');
    }

    const data = await apiRequest(`/v2/shopping/flight-offers?${params}`);

    return {
        flights: data.data.map(offer => parseFlightOffer(offer, data.dictionaries)),
        dictionaries: data.dictionaries,
    };
}

function parseFlightOffer(offer, dictionaries) {
    const itineraries = offer.itineraries.map(itinerary => {
        const segments = itinerary.segments.map(segment => ({
            departure: {
                iataCode: segment.departure.iataCode,
                terminal: segment.departure.terminal,
                at: segment.departure.at,
            },
            arrival: {
                iataCode: segment.arrival.iataCode,
                terminal: segment.arrival.terminal,
                at: segment.arrival.at,
            },
            carrierCode: segment.carrierCode,
            carrierName: dictionaries?.carriers?.[segment.carrierCode] || segment.carrierCode,
            flightNumber: segment.number,
            aircraft: dictionaries?.aircraft?.[segment.aircraft?.code] || segment.aircraft?.code,
            duration: segment.duration,
            numberOfStops: segment.numberOfStops || 0,
        }));

        return {
            duration: itinerary.duration,
            segments,
            stops: segments.length - 1,
        };
    });

    const airlines = [...new Set(
        itineraries.flatMap(it => it.segments.map(s => s.carrierCode))
    )];

    return {
        id: offer.id,
        price: {
            total: parseFloat(offer.price.total),
            currency: offer.price.currency,
            perAdult: parseFloat(offer.travelerPricings?.[0]?.price?.total || offer.price.total),
        },
        itineraries,
        airlines,
        airlineNames: airlines.map(code => dictionaries?.carriers?.[code] || code),
        bookingClass: offer.travelerPricings?.[0]?.fareDetailsBySegment?.[0]?.cabin || 'ECONOMY',
        seatsRemaining: offer.numberOfBookableSeats,
        validatingAirline: offer.validatingAirlineCodes?.[0],
        lastTicketingDate: offer.lastTicketingDate,
    };
}

export function formatDuration(isoDuration) {
    if (!isoDuration) return '';

    const match = isoDuration.match(/PT(?:(\d+)H)?(?:(\d+)M)?/);
    if (!match) return isoDuration;

    const hours = match[1] ? parseInt(match[1]) : 0;
    const minutes = match[2] ? parseInt(match[2]) : 0;

    if (hours && minutes) {
        return `${hours}h ${minutes}m`;
    } else if (hours) {
        return `${hours}h`;
    } else {
        return `${minutes}m`;
    }
}

export function formatTime(isoDateTime) {
    if (!isoDateTime) return '';

    const date = new Date(isoDateTime);
    return date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
    });
}

export function formatDate(isoDateTime) {
    if (!isoDateTime) return '';

    const date = new Date(isoDateTime);
    return date.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
    });
}

export function getDurationMinutes(isoDuration) {
    if (!isoDuration) return 0;

    const match = isoDuration.match(/PT(?:(\d+)H)?(?:(\d+)M)?/);
    if (!match) return 0;

    const hours = match[1] ? parseInt(match[1]) : 0;
    const minutes = match[2] ? parseInt(match[2]) : 0;

    return hours * 60 + minutes;
}
