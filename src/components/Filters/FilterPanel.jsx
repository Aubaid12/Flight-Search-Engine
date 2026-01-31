import { X, SlidersHorizontal } from 'lucide-react';
import { PriceFilter } from './PriceFilter';
import { StopsFilter } from './StopsFilter';
import { AirlineFilter } from './AirlineFilter';
import { TimeFilter } from './TimeFilter';
import './FilterPanel.css';

export function FilterPanel({
    filters,
    priceRange,
    availableAirlines,
    stopsCounts,
    onPriceChange,
    onStopToggle,
    onAirlineToggle,
    onTimeToggle,
    onClearAll,
    hasActiveFilters,
    isMobile = false,
    isOpen = false,
    onClose,
}) {
    const content = (
        <div className="filter-content">
            <div className="filter-header">
                <div className="filter-title">
                    <SlidersHorizontal size={20} />
                    <span>Filters</span>
                </div>
                {hasActiveFilters && (
                    <button className="clear-filters-btn" onClick={onClearAll}>
                        Clear All
                    </button>
                )}
                {isMobile && (
                    <button className="filter-close-btn" onClick={onClose}>
                        <X size={24} />
                    </button>
                )}
            </div>

            <div className="filter-sections">
                <PriceFilter
                    value={filters.priceRange}
                    range={priceRange}
                    onChange={onPriceChange}
                />

                <StopsFilter
                    selected={filters.stops}
                    counts={stopsCounts}
                    onToggle={onStopToggle}
                />

                <AirlineFilter
                    airlines={availableAirlines}
                    selected={filters.airlines}
                    onToggle={onAirlineToggle}
                />

                <TimeFilter
                    selected={filters.departureTime}
                    onToggle={onTimeToggle}
                />
            </div>

            {isMobile && (
                <button className="apply-filters-btn btn btn-primary" onClick={onClose}>
                    Apply Filters
                </button>
            )}
        </div>
    );

    if (isMobile) {
        return (
            <>
                <div
                    className={`filter-overlay ${isOpen ? 'open' : ''}`}
                    onClick={onClose}
                />
                <div className={`filter-drawer ${isOpen ? 'open' : ''}`}>
                    {content}
                </div>
            </>
        );
    }

    return <aside className="filter-panel">{content}</aside>;
}
