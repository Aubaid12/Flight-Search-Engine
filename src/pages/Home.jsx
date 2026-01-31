import { useState } from 'react';
import { Plane, SlidersHorizontal, Github } from 'lucide-react';
import { SearchForm } from '../components/SearchForm';
import { FlightList } from '../components/FlightResults';
import { FilterPanel } from '../components/Filters';
import { PriceGraph } from '../components/PriceGraph';
import { LoadingAnimation } from '../components/LoadingAnimation';
import { ThemeToggle } from '../components/ThemeToggle';
import { useFlightSearch } from '../hooks/useFlightSearch';
import { useFilters } from '../hooks/useFilters';
import '../App.css';

export function Home() {
    const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

    const {
        flights,
        loading,
        error,
        searchParams,
        search,
    } = useFlightSearch();

    const {
        filters,
        filteredFlights,
        priceRange,
        availableAirlines,
        stopsCounts,
        setPriceRange,
        toggleStop,
        toggleAirline,
        toggleDepartureTime,
        clearFilters,
        hasActiveFilters,
    } = useFilters(flights);

    const handleSearch = async (params) => {
        clearFilters();
        await search(params);
    };

    return (
        <>
            <header className="app-header">
                <div className="container header-content">
                    <a href="/" className="logo">
                        <Plane size={28} className="logo-icon" />
                        <span className="logo-text">Flight Search Engine</span>
                    </a>
                    <nav className="nav-links">
                        <ThemeToggle />
                    </nav>
                </div>
            </header>

            <main className="app-main">
                <section className="hero-section">
                    <div className="container">
                        <div className="hero-content">
                            <h1 className="hero-title">
                                Find Your Perfect Flight
                            </h1>
                            <p className="hero-subtitle">
                                Search hundreds of airlines to find the best deals
                            </p>
                        </div>
                        <SearchForm onSearch={handleSearch} loading={loading} />
                    </div>
                </section>

                {loading && (
                    <section className="results-section">
                        <div className="container">
                            <LoadingAnimation />
                        </div>
                    </section>
                )}

                {!loading && (flights.length > 0 || error || searchParams) && (
                    <section className="results-section">
                        <div className="container">
                            {flights.length > 0 && (
                                <>
                                    <PriceGraph
                                        flights={flights}
                                        filteredFlights={filteredFlights}
                                    />

                                    <button
                                        className="mobile-filter-btn btn btn-secondary"
                                        onClick={() => setMobileFiltersOpen(true)}
                                    >
                                        <SlidersHorizontal size={18} />
                                        Filters
                                        {hasActiveFilters && <span className="filter-badge" />}
                                    </button>
                                </>
                            )}

                            <div className="results-layout">
                                {flights.length > 0 && (
                                    <FilterPanel
                                        filters={filters}
                                        priceRange={priceRange}
                                        availableAirlines={availableAirlines}
                                        stopsCounts={stopsCounts}
                                        onPriceChange={setPriceRange}
                                        onStopToggle={toggleStop}
                                        onAirlineToggle={toggleAirline}
                                        onTimeToggle={toggleDepartureTime}
                                        onClearAll={clearFilters}
                                        hasActiveFilters={hasActiveFilters}
                                        isMobile={true}
                                        isOpen={mobileFiltersOpen}
                                        onClose={() => setMobileFiltersOpen(false)}
                                    />
                                )}

                                {flights.length > 0 && (
                                    <FilterPanel
                                        filters={filters}
                                        priceRange={priceRange}
                                        availableAirlines={availableAirlines}
                                        stopsCounts={stopsCounts}
                                        onPriceChange={setPriceRange}
                                        onStopToggle={toggleStop}
                                        onAirlineToggle={toggleAirline}
                                        onTimeToggle={toggleDepartureTime}
                                        onClearAll={clearFilters}
                                        hasActiveFilters={hasActiveFilters}
                                        isMobile={false}
                                    />
                                )}

                                <div className="results-main">
                                    <FlightList
                                        flights={filteredFlights}
                                        loading={false}
                                        error={error}
                                        searchParams={searchParams}
                                    />
                                </div>
                            </div>
                        </div>
                    </section>
                )}

                {!flights.length && !loading && !error && !searchParams && (
                    <section className="features-section">
                        <div className="container">
                            <div className="features-header">
                                <h2 className="features-title">Why Choose Us</h2>
                                <p className="features-subtitle">
                                    Discover the smartest way to search and compare flights
                                </p>
                            </div>
                            <div className="features-grid">
                                <div className="feature-card">
                                    <div className="feature-icon">✈️</div>
                                    <h3>500+ Airlines</h3>
                                    <p>Compare flights from hundreds of airlines worldwide</p>
                                </div>
                                <div className="feature-card">
                                    <div className="feature-icon">💰</div>
                                    <h3>Best Prices</h3>
                                    <p>Find the most competitive fares with real-time pricing</p>
                                </div>
                                <div className="feature-card">
                                    <div className="feature-icon">🎯</div>
                                    <h3>Smart Filters</h3>
                                    <p>Refine results by stops, airlines, price, and more</p>
                                </div>
                                <div className="feature-card">
                                    <div className="feature-icon">📊</div>
                                    <h3>Price Insights</h3>
                                    <p>Visualize price trends to find the best deals</p>
                                </div>
                            </div>
                        </div>
                    </section>
                )}
            </main>

            <footer className="app-footer">
                <div className="container footer-content">
                    <div className="footer-links">
                        <a href="#" className="footer-link">Privacy</a>
                        <a href="#" className="footer-link">Terms</a>
                        <a href="https://github.com" className="footer-link">
                            <Github size={16} />
                        </a>
                    </div>
                </div>
            </footer>
        </>
    );
}
