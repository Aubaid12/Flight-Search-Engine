import { useLocation, Link, useNavigate } from 'react-router-dom';
import { Check, Home, Download } from 'lucide-react';
import { useEffect } from 'react';
import './BookingSuccess.css';

export function BookingSuccess() {
    const location = useLocation();
    const navigate = useNavigate();
    const flight = location.state?.flight;

    // Generate random booking reference
    const bookingRef = Math.random().toString(36).substring(2, 8).toUpperCase();

    useEffect(() => {
        if (!flight) {
            navigate('/');
        }
    }, [flight, navigate]);

    if (!flight) return null;

    return (
        <div className="booking-success-container">
            <div className="success-card">
                <div className="success-icon-wrapper">
                    <Check size={40} className="text-success" color="#10b981" />
                </div>

                <h1 className="success-title">Booking Confirmed!</h1>
                <p className="success-message">
                    Your flight has been successfully booked. A confirmation email has been sent to your inbox.
                </p>

                <div className="booking-ref">
                    <span className="ref-label">Booking Reference</span>
                    <span className="ref-code">{bookingRef}</span>
                </div>

                <div className="flight-summary-card">
                    <div className="summary-header">
                        <span className="airline-info">{flight.airlineNames[0]}</span>
                        <span className="class-info text-muted">{flight.travelClass || 'Economy'}</span>
                    </div>

                    <div className="route-info">
                        <div className="city-code">{flight.itineraries[0].segments[0].departure.iataCode}</div>
                        <div className="flight-path-line"></div>
                        <div className="city-code">{flight.itineraries[0].segments[flight.itineraries[0].segments.length - 1].arrival.iataCode}</div>
                    </div>

                    <div className="text-muted text-sm">
                        Total Price: {flight.price.currency} {flight.price.total}
                    </div>
                </div>

                <div className="actions">
                    <Link to="/" className="home-btn btn btn-primary">
                        <Home size={18} style={{ marginRight: 8 }} />
                        Back to Home
                    </Link>
                </div>
            </div>
        </div>
    );
}
