import { useState } from 'react';
import { ChevronDown, Plane, Clock, Briefcase } from 'lucide-react';
import { formatDuration, formatTime, formatDate } from '../../services/amadeus';
import { BookingModal } from './BookingModal';
import './FlightCard.css';

export function FlightCard({ flight }) {
    const [expanded, setExpanded] = useState(false);
    const [showBooking, setShowBooking] = useState(false);

    const outbound = flight.itineraries[0];
    const returning = flight.itineraries[1];

    const firstSegment = outbound.segments[0];
    const lastSegment = outbound.segments[outbound.segments.length - 1];

    return (
        <article className="flight-card">
            <div className="flight-main" onClick={() => setExpanded(!expanded)}>
                <div className="flight-info">
                    <div className="flight-route">
                        <div className="flight-leg">
                            <div className="flight-time-block">
                                <span className="flight-time">{formatTime(firstSegment.departure.at)}</span>
                                <span className="flight-airport">{firstSegment.departure.iataCode}</span>
                            </div>

                            <div className="flight-duration-block">
                                <span className="flight-duration">{formatDuration(outbound.duration)}</span>
                                <div className="flight-line">
                                    <div className="flight-line-dot" />
                                    <div className="flight-line-bar" />
                                    <Plane size={16} className="flight-line-plane" />
                                    <div className="flight-line-bar" />
                                    <div className="flight-line-dot" />
                                </div>
                                <span className="flight-stops">
                                    {outbound.stops === 0 ? 'Nonstop' : `${outbound.stops} stop${outbound.stops > 1 ? 's' : ''}`}
                                </span>
                            </div>

                            <div className="flight-time-block">
                                <span className="flight-time">{formatTime(lastSegment.arrival.at)}</span>
                                <span className="flight-airport">{lastSegment.arrival.iataCode}</span>
                            </div>
                        </div>

                        {returning && (
                            <div className="flight-leg return">
                                <div className="flight-time-block">
                                    <span className="flight-time">
                                        {formatTime(returning.segments[0].departure.at)}
                                    </span>
                                    <span className="flight-airport">
                                        {returning.segments[0].departure.iataCode}
                                    </span>
                                </div>

                                <div className="flight-duration-block">
                                    <span className="flight-duration">{formatDuration(returning.duration)}</span>
                                    <div className="flight-line return">
                                        <div className="flight-line-dot" />
                                        <div className="flight-line-bar" />
                                        <Plane size={16} className="flight-line-plane" />
                                        <div className="flight-line-bar" />
                                        <div className="flight-line-dot" />
                                    </div>
                                    <span className="flight-stops">
                                        {returning.stops === 0 ? 'Nonstop' : `${returning.stops} stop${returning.stops > 1 ? 's' : ''}`}
                                    </span>
                                </div>

                                <div className="flight-time-block">
                                    <span className="flight-time">
                                        {formatTime(returning.segments[returning.segments.length - 1].arrival.at)}
                                    </span>
                                    <span className="flight-airport">
                                        {returning.segments[returning.segments.length - 1].arrival.iataCode}
                                    </span>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="flight-airlines">
                        {flight.airlineNames.slice(0, 2).map((name, idx) => (
                            <span key={idx} className="airline-badge">
                                {name}
                            </span>
                        ))}
                        {flight.airlineNames.length > 2 && (
                            <span className="airline-more">+{flight.airlineNames.length - 2}</span>
                        )}
                    </div>
                </div>

                <div className="flight-booking">
                    <div className="flight-price">
                        <span className="price-currency">{flight.price.currency}</span>
                        <span className="price-amount">${flight.price.total.toFixed(0)}</span>
                        <span className="price-label">total</span>
                    </div>

                    <button
                        className="select-btn btn btn-primary"
                        onClick={(e) => {
                            e.stopPropagation();
                            setShowBooking(true);
                        }}
                    >
                        Select
                    </button>

                    <button
                        className={`expand-btn ${expanded ? 'expanded' : ''}`}
                        onClick={(e) => { e.stopPropagation(); setExpanded(!expanded); }}
                        aria-label="Show details"
                    >
                        <ChevronDown size={20} />
                    </button>
                </div>
            </div>

            {expanded && (
                <div className="flight-details">
                    <div className="details-section">
                        <h4 className="details-title">
                            <Plane size={16} />
                            Outbound Flight
                        </h4>
                        {outbound.segments.map((segment, idx) => (
                            <SegmentDetail key={idx} segment={segment} />
                        ))}
                    </div>

                    {returning && (
                        <div className="details-section">
                            <h4 className="details-title">
                                <Plane size={16} className="return-icon" />
                                Return Flight
                            </h4>
                            {returning.segments.map((segment, idx) => (
                                <SegmentDetail key={idx} segment={segment} />
                            ))}
                        </div>
                    )}

                    <div className="details-meta">
                        <div className="meta-item">
                            <Briefcase size={16} />
                            <span>{formatCabinClass(flight.bookingClass)}</span>
                        </div>
                        {flight.seatsRemaining && flight.seatsRemaining < 10 && (
                            <div className="meta-item urgency">
                                <span>Only {flight.seatsRemaining} seats left!</span>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {showBooking && (
                <BookingModal
                    flight={flight}
                    onClose={() => setShowBooking(false)}
                />
            )}
        </article>
    );
}

function SegmentDetail({ segment }) {
    return (
        <div className="segment-detail">
            <div className="segment-carrier">
                <span className="carrier-name">{segment.carrierName}</span>
                <span className="flight-number">{segment.carrierCode} {segment.flightNumber}</span>
            </div>

            <div className="segment-route">
                <div className="segment-point">
                    <span className="segment-time">{formatTime(segment.departure.at)}</span>
                    <span className="segment-code">{segment.departure.iataCode}</span>
                    <span className="segment-date">{formatDate(segment.departure.at)}</span>
                    {segment.departure.terminal && (
                        <span className="segment-terminal">Terminal {segment.departure.terminal}</span>
                    )}
                </div>

                <div className="segment-duration">
                    <Clock size={14} />
                    <span>{formatDuration(segment.duration)}</span>
                </div>

                <div className="segment-point">
                    <span className="segment-time">{formatTime(segment.arrival.at)}</span>
                    <span className="segment-code">{segment.arrival.iataCode}</span>
                    <span className="segment-date">{formatDate(segment.arrival.at)}</span>
                    {segment.arrival.terminal && (
                        <span className="segment-terminal">Terminal {segment.arrival.terminal}</span>
                    )}
                </div>
            </div>

            {segment.aircraft && (
                <div className="segment-aircraft">
                    Aircraft: {segment.aircraft}
                </div>
            )}
        </div>
    );
}

function formatCabinClass(cabin) {
    const classes = {
        ECONOMY: 'Economy',
        PREMIUM_ECONOMY: 'Premium Economy',
        BUSINESS: 'Business',
        FIRST: 'First Class',
    };
    return classes[cabin] || cabin;
}
