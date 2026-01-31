import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { X, CheckCircle, Loader2, ExternalLink, Plane } from 'lucide-react';
import { formatDuration } from '../../services/amadeus';
import './BookingModal.css';

export function BookingModal({ flight, onClose }) {
    const [status, setStatus] = useState('idle'); // idle, checking, redirecting
    const navigate = useNavigate();

    const handleBook = () => {
        setStatus('checking');

        // Simulate API check
        setTimeout(() => {
            setStatus('redirecting');

            // Simulate redirect delay
            setTimeout(() => {
                navigate('/success', { state: { flight } });
                onClose();
            }, 1000);
        }, 1500);
    };

    // prevent scrolling when modal is open
    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, []);

    const outbound = flight.itineraries[0];
    const firstSegment = outbound.segments[0];
    const lastSegment = outbound.segments[outbound.segments.length - 1];

    const content = status === 'idle' ? (
        <>
            <div className="booking-modal-header">
                <div>
                    <h2 className="booking-title">Confirm Selection</h2>
                    <span className="booking-subtitle">You are being redirected to the airline</span>
                </div>
                <button className="close-btn" onClick={onClose}>
                    <X size={24} />
                </button>
            </div>

            <div className="booking-summary">
                <div className="summary-row">
                    <div className="route-text">
                        {firstSegment.departure.iataCode} → {lastSegment.arrival.iataCode}
                    </div>
                    <div className="flight-overview">
                        {flight.itineraries.length > 1 ? 'Round Trip' : 'One Way'} • {formatDuration(outbound.duration)}
                    </div>
                </div>

                <div className="summary-row">
                    <span>Total Price</span>
                    <span className="price-text">
                        {flight.price.currency} {flight.price.total}
                    </span>
                </div>
            </div>

            <div className="booking-action">
                <div className="provider-info">
                    <Plane size={20} className="text-muted" />
                    <span className="provider-text">
                        Book directly with <span className="provider-name">{flight.airlineNames[0]}</span>
                    </span>
                </div>

                <button className="book-btn btn-primary" onClick={handleBook}>
                    Continue to Book
                    <ExternalLink size={18} />
                </button>
            </div>
        </>
    ) : (
        <div className="processing-state">
            {status === 'checking' ? (
                <>
                    <div className="spinner" />
                    <h3 className="status-text">Checking availability...</h3>
                    <p className="status-subtext">Verifying current price with airline</p>
                </>
            ) : (
                <>
                    <CheckCircle size={48} color="#10b981" style={{ margin: '0 auto 16px', display: 'block' }} />
                    <h3 className="status-text">Redirecting you</h3>
                    <p className="status-subtext">Have a safe trip!</p>
                </>
            )}
        </div>
    );

    return createPortal(
        <div className="booking-modal-overlay" onClick={onClose}>
            <div className="booking-modal" onClick={e => e.stopPropagation()}>
                {content}
            </div>
        </div>,
        document.body
    );
}
