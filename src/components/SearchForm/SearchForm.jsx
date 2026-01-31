import { useState } from 'react';
import { Search, ArrowRightLeft, PlaneTakeoff, PlaneLanding } from 'lucide-react';
import { format, addDays } from 'date-fns';
import { AirportAutocomplete } from './AirportAutocomplete';
import { DatePicker } from './DatePicker';
import { PassengerSelector } from './PassengerSelector';
import { CabinClassSelector } from './CabinClassSelector';
import './SearchForm.css';

export function SearchForm({ onSearch, loading }) {
    const [tripType, setTripType] = useState('roundTrip');
    const [origin, setOrigin] = useState(null);
    const [destination, setDestination] = useState(null);
    const [departureDate, setDepartureDate] = useState(
        format(addDays(new Date(), 7), 'yyyy-MM-dd')
    );
    const [returnDate, setReturnDate] = useState(
        format(addDays(new Date(), 14), 'yyyy-MM-dd')
    );
    const [passengers, setPassengers] = useState({ adults: 1, children: 0, infants: 0 });
    const [cabinClass, setCabinClass] = useState('ECONOMY');

    const swapLocations = () => {
        const temp = origin;
        setOrigin(destination);
        setDestination(temp);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!origin || !destination || !departureDate) {
            return;
        }

        onSearch({
            origin: origin.iataCode,
            destination: destination.iataCode,
            departureDate,
            returnDate: tripType === 'roundTrip' ? returnDate : null,
            adults: passengers.adults,
            children: passengers.children,
            infants: passengers.infants,
            travelClass: cabinClass,
        });
    };

    const isValid = origin && destination && departureDate && (tripType === 'oneWay' || returnDate);

    return (
        <form className="search-form" onSubmit={handleSubmit}>
            <div className="trip-type-toggle">
                <button
                    type="button"
                    className={`trip-type-btn ${tripType === 'roundTrip' ? 'active' : ''}`}
                    onClick={() => setTripType('roundTrip')}
                >
                    Round Trip
                </button>
                <button
                    type="button"
                    className={`trip-type-btn ${tripType === 'oneWay' ? 'active' : ''}`}
                    onClick={() => setTripType('oneWay')}
                >
                    One Way
                </button>
            </div>

            <div className="search-fields">
                <div className="location-fields">
                    <AirportAutocomplete
                        value={origin}
                        onChange={setOrigin}
                        placeholder="Where from?"
                        label="From"
                        icon={PlaneTakeoff}
                    />

                    <button
                        type="button"
                        className="swap-btn"
                        onClick={swapLocations}
                        aria-label="Swap locations"
                    >
                        <ArrowRightLeft size={20} />
                    </button>

                    <AirportAutocomplete
                        value={destination}
                        onChange={setDestination}
                        placeholder="Where to?"
                        label="To"
                        icon={PlaneLanding}
                    />
                </div>

                <div className="date-fields">
                    <DatePicker
                        label="Departure"
                        value={departureDate}
                        onChange={setDepartureDate}
                    />
                    <DatePicker
                        label="Return"
                        value={returnDate}
                        onChange={setReturnDate}
                        minDate={departureDate ? new Date(departureDate) : undefined}
                        disabled={tripType === 'oneWay'}
                    />
                </div>

                <div className="passenger-fields">
                    <PassengerSelector
                        value={passengers}
                        onChange={setPassengers}
                    />
                    <CabinClassSelector
                        value={cabinClass}
                        onChange={setCabinClass}
                    />
                </div>
            </div>

            <button
                type="submit"
                className="search-submit btn btn-primary btn-lg"
                disabled={!isValid || loading}
            >
                {loading ? (
                    <>
                        <span className="search-spinner" />
                        Searching...
                    </>
                ) : (
                    <>
                        <Search size={20} />
                        Search Flights
                    </>
                )}
            </button>
        </form>
    );
}
